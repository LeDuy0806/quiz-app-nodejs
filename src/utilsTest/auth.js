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
    mail: 'anhquoc18092003@gmail.com',
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
    userName: 'QuocAnh',
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
    signInPassWordInvalid
};
