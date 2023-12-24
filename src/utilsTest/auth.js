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

const signUpValid = {
    mail: 'tranthanh18092003@gmail.com',
    userName: 'TranThanh',
    firstName: 'Tran',
    lastName: 'Thanh',
    avatar: '',
    userType: 'Teacher',
    point: 0,
    follows: [],
    friends: [],
    password: 'QuocAnh-1809',
    workspace: { logo: '', name: { en: '', vn: '' } },
    bio: '',
    emailToken: '',
    isVerified: true,
    update: {
        profile: '',
        mail: '',
        password: ''
    }
};

const signUpEmailExist = {
    mail: 'thuhien18092003@gmail.com',
    userName: 'QuocAnh123',
    firstName: 'Quoc',
    lastName: 'Anh',
    avatar: '',
    userType: 'Teacher',
    point: 0,
    follows: [],
    friends: [],
    workspace: { logo: '', name: { en: '', vn: '' } },
    bio: '',
    password: 'anhquoc123',
    emailToken: '',
    isVerified: true,
    update: {
        profile: '',
        mail: '',
        password: ''
    }
};

const signUpUserNameExist = {
    mail: 'tranthanh18092003@gmail.com',
    userName: 'ThuHien123',
    firstName: 'Thu',
    lastName: 'Hien',
    avatar: '',
    userType: 'Teacher',
    point: 0,
    follows: [],
    friends: [],
    workspace: { logo: '', name: { en: '', vn: '' } },
    bio: '',
    password: 'anhquoc123',
    emailToken: '',
    isVerified: true,
    update: {
        profile: '',
        mail: '',
        password: ''
    }
};

const signInValid = {
    mail: 'anhquoc18092003@gmail.com',
    password: 'QuocAnh-1809'
};

const signInEmailNotExist = {
    mail: 'tranthanh18092003@gmail.com',
    password: 'QuocAnh-1809'
};

const signInPassWordInvalid = {
    mail: 'anhquoc18092003@gmail.com',
    password: 'anhquoc1809'
};

export {
    signUpValid,
    signUpEmailExist,
    signUpUserNameExist,
    signInValid,
    signInEmailNotExist,
    signInPassWordInvalid,
    EmailFormat,
    RequirePassword,
    RequireLong,
    RequireShort
};
