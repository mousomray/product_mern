export const endpoints = {

    auth: {
        register: "auth/register",
        login: "auth/login",
        dashboard: "auth/dashboard",
        forget: "auth/forgetpassword",
        update: "auth/updatepassword",
        verify: "auth/verifyotp"
    },

    cms: {
        create: "api/createproduct",
        read: "api/productlist",
        single: "api/singleproduct",
        update: "api/editproduct",
        delete: "api/delete"
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
    endpoints.auth.update, //Index number 7
]