import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
mutation createProduct(
    $category: Int!
    $description: String
    $images: [Upload]
    $name: String!
    $price: Float!
    ){
        createProduct(
            category: $category
            description: $description
            price: $price
            images: $images
            name: $name){
            id
            name
        }
    }
`

export const UPDATE_PRODUCT = gql`
mutation updateProduct(
    $id: ID!
    $category: Int
    $description: String
    $images: [Upload]
    $name: String
    $price: Float
    ){
        updateProduct(
            id: $id
            category: $category
            description: $description
            price: $price
            images: $images
            name: $name){
            id
            name
        }
    }
`

export const UPDATE_PRODUCT_STATUS = gql`
mutation updateProductStatus(
    $id: ID!
    $publish: Boolean!
    ){
        updateProductStatus(
            id: $id
            publish: $publish
        ){
            id
            publish
        }
    }
`

export const DELETE_PRODUCT = gql`
mutation deleteProduct(
    $id: ID!
    ){
        deleteProduct(
            id: $id
        ){
            id
        }
    }
`

export const REGISTER = gql`
    mutation createUser(
        $phone: String!
        $company: String
        $password: String!
        $firstName: String
        $lastName: String
    ){
        createUser(
            phone: $phone
            company: $company
            firstName: $firstName
            lastName: $lastName
            password: $password
        ){
            phone
            firstName
        }
    }
`

export const UPDATE_USER = gql`
    mutation updateUser(
        $id: ID!
        $phone: String
        $city: Int
        $profileDescription: String
        $accountType: String
        $shopLogo: Upload
    ){
        updateUser(
            id: $id
            phone: $phone
            company: $company
            profileDescription: $profileDescription
            account_type: $accountType
            shopLogo: $shopLogo
        ){
            id
            phone
            company
            profileDescription
            account_type
            lastSouscription
            shopLogo {
                id
                image
            }
        }
    }
`

export const LOGINUSER = gql`
    mutation login(
        $phone: String!
        $password: String!
    ){
        login(
            phone: $phone
            password: $password
        ){
            token
            refreshExpiresIn
        }
    }
`