const EmailFormat = (value) => {
    var email =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === '') {
        return null;
    }
    if (email.test(value)) {
        return true;
    } else {
        return false;
    }
};

const RequirePassword = (value) => {
    var password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    if (!value) {
        return null;
    } else {
        if (password.test(value)) {
            return 'strong';
        } else {
            if (value.length < 8) {
                return 'weak';
            } else {
                return 'medium';
            }
        }
    }
};

const RequireLong = (value) => {
    if (!value) {
        return null;
    } else {
        if (value.length > 30 || value.length < 5) {
            return 'weak';
        } else {
            return 'strong';
        }
    }
};

const RequireShort = (value) => {
    if (!value) {
        return null;
    } else {
        if (/[0-9]/.test(value) || value.length > 5 || value.length < 2) {
            return 'weak';
        } else {
            return 'strong';
        }
    }
};

const signUpEmailNotFormat = {
    mail: 'tranthanh18092003@gmail',
    userNameNotStandard: 'Anh',
    userNameStandard: 'TranThanh',
    passwordWeak: 'anh',
    passwordMedium: 'anhquoc1',
    passwordValid: 'QuocAnh-1809'
};

const signUpEmailFormat = {
    mail: 'tranthanh18092003@gmail.com',
    userNameNotStandard: 'Anh',
    userNameStandard: 'TranThanh',
    passwordWeak: 'anh',
    passwordMedium: 'anhquoc1',
    passwordValid: 'QuocAnh-1809'
};

const signUpEmailExist = {
    mail: 'thuhien18092003@gmail.com',
    userName: 'QuocAnh123',
    firstName: 'Quoc',
    lastName: 'Anh'
};

const signUpUserNameExist = {
    mail: 'tranthanh18092003@gmail.com',
    userName: 'ThuHien123',
    firstName: 'Thu',
    lastName: 'Hien'
};

const signInEmailValid = {
    mail: 'anhquoc18092003@gmail.com',
    passwordWeak: 'anh',
    passwordMedium: 'anhquoc1',
    passwordValid: 'QuocAnh-1809'
};

const signInEmailNotExist = {
    mail: 'tranthanh18092003@gmail.com',
    passwordWeak: 'anh',
    passwordMedium: 'anhquoc1',
    passwordStrong: 'QuocAnh-1809'
};

const signInEmailNotStandard = {
    mail: 'anhquoc18092003@gmail',
    passwordWeak: 'anh',
    passwordMedium: 'anhquoc1',
    passwordStrong: 'QuocAnh-1809'
};

export {
    signUpEmailFormat,
    signUpEmailNotFormat,
    signUpEmailExist,
    signUpUserNameExist,
    signInEmailValid,
    signInEmailNotExist,
    signInEmailNotStandard,
    EmailFormat,
    RequirePassword,
    RequireLong,
    RequireShort
};
