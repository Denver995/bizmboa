import { ReactNativeFile } from "apollo-upload-client";

import * as mime from "react-native-mime-types";

export const generateRNFile = (uri: any, name: any) => {
    if(uri === null) return;
    const result = uri ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || "image",
        name,
    }) : null;
    return result
}