import moment from "moment";

export const GetLoggedInUserName = (user) => {
    if(user.userType === "donar") {
        return user.name;
    }
    else if(user.userType === "hospital") {
        return user.hospitalName;
    }
    else if(user.userType === "organization") {
        return user.organizationName;
    }
    else {
        return user.name;
    }
}

export const GetAntdInputValidation = () => {
    return [
        {
            required: true,
            message: "Required"
        }
    ]
}

export const GetDateFormat = (date) => {
    return moment(date).format("DD MMM YYYY hh:mm A")
}