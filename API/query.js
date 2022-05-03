import { gql } from "@apollo/client";
export const ALL_PRODUCT = gql`
    query allProduct($name: String, $first: Int, $after: String){
        allProducts(name_Istartswith: $name, first: $first, after: $after, publish: true, deleted: false){
            pageInfo {
                endCursor
                hasNextPage
            }
            __typename
            edges {
                cursor
                node {
                    id
                    name
                    price
                    note
                    description
                    category {
                        id
                        name
                    }
                    createdAt
                    publish
                    deleted
                    createdBy{
                        phone
                    }
                    images {
                        id
                        image
                    }
                }
            }
        }
    }
`;

export const FILTER_PRODUCT = gql`
    query allProduct($name: String, $category: String, $maxPrice: Float, $minPrice: Float, $first: Int, $after: String){
        allProducts(name_Istartswith: $name, price_Gt: $minPrice, price_Lt: $maxPrice, category_Name_Iexact: $category, first: $first, after: $after, publish: true, deleted: false){
            pageInfo {
                endCursor
                hasNextPage
            }
            __typename
            edges {
                cursor
                node {
                    id
                    name
                    price
                    note
                    description
                    category {
                        id
                        name
                    }
                    createdAt
                    publish
                    deleted
                    createdBy{
                        phone
                    }
                    images {
                        id
                        image
                    }
                }
            }
        }
    }
`;

export const ALL_CATEGORIES = gql`
    query ListCategory {
        allCategory {
            id
            name
            iconName
        }
    }
`

export const ALL_CITIES = gql`
    query ListCity {
        allCity {
            id
            name
        }
    }
`

export const PRODUCT_BY_ID = gql`
    query productById($id: Int!){
        productById(id: $id){
            id
            name
            price
            note
            description
            createdAt
            publish
            images{
                id
                name
                image
            }
        }
    }
`

export const PRODUCT_BY_USER = gql`
    query allProduct($id: Float, $first: Int, $after: String) {
        allProducts(createdBy_Id: $id, first: $first, after: $after, deleted: false) {
            pageInfo {
                endCursor
                hasNextPage
            }
            __typename
            edges {
                cursor
                node {
                    id
                    name
                    price
                    note
                    description
                    publish
                    deleted
                    category {
                        id
                        name
                    }
                    createdAt
                    createdBy{
                        id
                        phone
                        firstName
                        company
                    }
                    images {
                        id
                        image
                    }
                }
            }
        }
    }
`

export const SEARCH_PRODUCT = gql`
    query Search($keyword: String!){
        searchProduct(keyword: $keyword){
            id
            name
            price
            note
            description
            publish
            deleted
            category {
                name
            }
            images{
                id
                name
                image
            }
        }
    }
`

export const PRODUCT_BY_CATEGORY = gql`
    query allProduct($name: String, $first: Int, $after: String) {
        allProducts(category_Name_Iexact: $name, first: $first, after: $after, publish: true, deleted: false) {
            pageInfo {
                endCursor
                hasNextPage
            }
            __typename
            edges {
                cursor
                node {
                    id
                    name
                    price
                    note
                    description
                    publish
                    deleted
                    category {
                        id
                        name
                    }
                    createdAt
                    createdBy{
                        phone
                    }
                    images {
                        id
                        image
                    }
                }
            }
        }
    }
`

export const FAVORITES_PRODUCTS = gql`
    query FavoritesProducts($id: Int!){
        favoritesProducts(id: $id){
            id
            name
            price
            description
            created_at
        }
    }
`

export const USER_INFO = gql`
    query connectedUser{
        connectedUser{
            id
            email
            company
            phone
            city {
                id
                name
            }
            shopLogo {
                id
                image
            }
            firstName
            lastName
            profileDescription
            dateJoined
        }
    }
`;

export const ALL_USERS = gql`
    query allUser($phone: String, $company: String, $first: Int, $after: String){
        allUsers(phone_Istartswith: $phone, company_Istartswith: $company, first: $first, after: $after){
            pageInfo {
                endCursor
                hasNextPage
            }
            __typename
            edges {
                cursor
                node {
                    id
                    email
                    company
                    phone
                    city {
                        id
                        name
                    }
                    shopLogo {
                        id
                        image
                    }
                    firstName
                    lastName
                    profileDescription
                    dateJoined
                    lastSouscription
                }
            }
        }
    }
`;