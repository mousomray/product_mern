export const endpoints = {

    auth: {
        register: "auth/register",
        login: "auth/login",
        dashboard: "auth/dashboard",
        forget: "auth/forgetpassword",
        update: "auth/updatepassword",
        verify: "auth/verifyotp",
        resetlink: "auth/resetpasswordlink"

    },

    cms: {
        create: "api/createproduct",
        read: "api/productlist",
        single: "api/singleproduct",
        update: "api/editproduct",
        delete: "api/delete",
        addcart: "api/addcart",
        cart: "api/cart",
        lesscart: "api/decrease"
    },

}

export const myendpoints = [
    endpoints.auth.register, //Index number 0
    endpoints.auth.login, //Index number 1
    endpoints.auth.dashboard, //Index number 2
    endpoints.cms.create, //Index number 3
    endpoints.cms.read, //Index number 4
    endpoints.cms.single, //Index number 5
    endpoints.cms.update, //Index number 6
    endpoints.cms.delete, //Index number 7
    endpoints.auth.verify, //Index number 8
    endpoints.auth.update, //Index number 9
    endpoints.auth.resetlink, //Index number 10
    endpoints.auth.forget, //Index number 11
    endpoints.cms.addcart, //Index number 12
    endpoints.cms.cart, //Index number 13
    endpoints.cms.lesscart, //Index number 14
]