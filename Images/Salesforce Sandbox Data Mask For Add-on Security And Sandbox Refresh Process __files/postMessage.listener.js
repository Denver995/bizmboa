(function (factory) {
	var moduleName = "postMessage";

	if (typeof ccs_define === "function") {
		ccs_define(moduleName, ["jquery"], factory);
		return;
	}

	var moduleExport = factory(window.ccsJq);
	if (typeof moduleExport !== "undefined") {
		window[moduleName] = moduleExport;
	}
}
	(function ($) {
		if (!window.postMessage)
			return;

		var postMessageListener = (function () {

			function messageHandler(event) {
				if (!window.ccsPostMessageListener.isInTrusted(event.origin))
					return;

				var msg = event.data;

				var isMessageReceived = true;
				var data = {};

				try {
					data = $.parseJSON(msg);
					if (!data.messageType || !data.params) {
						isMessageReceived = false;
					}
				}
				catch (e) {
					isMessageReceived = false;
				}

				if (!isMessageReceived) {
					return;
				}

				switch (data.messageType) {
					case "heightUpdateRequest":
						onHeightUpdateRequest(data.params);
						break;
					case "scrollingChangeRequest":
						onScrollingChangeRequest(data.params);
						break;
					case "executeJsRequest":
						onExecuteJsRequest(data.params);
						break;
					case "linkToParentRequest":
						openFancyboxThroughIframe(data.params);
						break;
				}
			};

			function openFancyboxThroughIframe(params) {
				ccs_require("Fancybox");

				$.fancybox.open({
					type: "iframe",
					src: params.url,
					smallBtn: true,
					baseClass: "ccs-fancybox-dccn-features",
					iframe: {
						attr: {
							"data-autoheight-id": params.autoHeightId
						},
						css: { width: 430 }
					},
					afterLoad: function (instance, current) {
						current.$content.css("height", "auto");
					}
				});
			}

			function onHeightUpdateRequest(params) {
				var $iframe = $("iframe[data-autoheight-id='" + params.autoHeightId + "']");
				$iframe.css("height", params.height);
			};

			function onScrollingChangeRequest(params) {
				var $iframe = $("iframe[data-autoheight-id='" + params.autoHeightId + "']");
				$iframe.attr("scrolling", params.scrolling);
			};

			function onExecuteJsRequest(params) {
				var func = new Function(params);
				func();
			};

			function ctr() {
				this.trustedDomains = [];

				if (window.addEventListener) {
					window.addEventListener("message", messageHandler, false);
				} else {
					window.attachEvent("onmessage", messageHandler);
				}
			}

			ctr.prototype.addTrustedDomain = function (domain) {
				if ($.isArray(domain)) {
					for (var i in domain) {
						if (this.isInTrusted(domain[i]))
							return;

						this.trustedDomains.push(domain[i]);
					}
					return;
				}

				if (this.isInTrusted(domain))
					return;

				this.trustedDomains.push(domain);
			};

			ctr.prototype.isInTrusted = function (domain) {
				return $.inArray(domain, this.trustedDomains) !== -1;
			}

			return ctr;
		}());

		window.ccsPostMessageListener = window.ccsPostMessageListener || new postMessageListener();
	}));
