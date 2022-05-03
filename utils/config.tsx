export const defaultConfig = {
    color: '#f4511e',
    themes: { default: '', dark: ''},
    fontFamily: '',
    fontSize: ''
}

export const defaultCategories = [
    {
        name: 'Téléphones/Tablettes',
        iconName: 'tablet-android',
        iconType: 'materialIcon',
        id: 1
    },
    {
        name: 'Ordinateurs & Bureautiques',
        iconName: 'laptop',
        iconType: 'materialIcon',
        id: 2
    },
    {
        name: 'Télévisions',
        iconName: 'television-clean',
        iconType: 'materialIcon',
        id: 3
    },
    {
        name: 'Montres, Bijoux et Acessoires',
        iconName: 'watch',
        iconType: 'materialIcon',
        id: 4
    },
    {
        name: 'Vêtements-Chaussures-Sacs',
        iconName: 'shoe-print',
        iconType: 'materialIcon',
        id: 5
    },
    {
        name: 'Immobilier',
        iconName: 'home-city-outline',
        iconType: 'materialIcon',
        id: 6
    },
    {
        name: 'Véhicules(Voitures, Motos, Bicyclettes)',
        iconName: 'car-multiple', //car-side,
        iconType: 'materialIcon',
        id: 7
    },
]

export const defaultContact = {
    "name": "BIZGOMBOA",
    "username": "BIZGOMBOA",
    "address": {
      "city": "Douala",
      "state": "Littoral",
      "country": "Cameroun",
      "zipcode": "41428-0189",
      "geo": {
        "lat": "-75.8513",
        "lng": "81.3262"
      }
    },
    "website": "www.bizgomboa.com",
    "bio":
      "Plateforme de mise en relation client-achateur",
    "company": {
      "name": "BizgoMboa",
      "catchPhrase": "Le coin des bonnes affaires",
      "bs": "user-centric embrace vortals"
    },
    "avatar": "https://i.imgur.com/GfkNpVG.jpg",
    "avatarBackground": "https://i.imgur.com/rXVcgTZ.jpg",
    "tels": [
      { "id": 1, "name": "Whatsapp & Appel", "number": "+237 694 74 37 94" },
      // { "id": 2, "name": "Call", "number": "+237 694 74 37 94" }
    ],
    "emails": [
      { "id": 1, "name": "Personal", "email": "denverclaude99@gmail.com" },
      { "id": 2, "name": "Work", "email": "freddhymbella@gmail.com" }
    ]
}

// export const api_url = 'https://bizmboa.herokuapp.com';
// export const media_url = 'https://bizmboa.herokuapp.com/media';
export const api_url = 'http://0552-41-202-207-1.ngrok.io';
export const media_url = 'http://0552-41-202-207-1.ngrok.io/media';