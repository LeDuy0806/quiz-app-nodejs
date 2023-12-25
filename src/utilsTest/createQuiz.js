export const createQuizRequest = {
    name: 'Quiz Example 3',
    creator: {
        _id: '657bb88103adc5835c989d27',
        userName: 'VanDuy',
        avatar: 'https://res.cloudinary.com/dfl3qnj7z/image/upload/v1686508871/qyqduwn5yshei6higmbo.jpg',
        userType: 'Teacher',
        firstName: 'Duy',
        lastName: 'Van'
    },
    description: 'đây là mô tả',
    backgroundImage:
        'https://res.cloudinary.com/dfoiuc0jw/image/upload/v1702482830/examples/avatar/rbqs5yfyhzbbffgsmh7x.jpg',
    isPublic: false,
    pointsPerQuestion: 1,
    tags: [],
    importFrom: '',
    likesCount: [],
    questionList: [
        {
            _id: '',
            content: '1+1',
            creator: '657bb88103adc5835c989d27',
            tags: [],
            backgroundImage:
                'https://res.cloudinary.com/dfoiuc0jw/image/upload/v1702482908/examples/avatar/x0vcqmiurbukz0uk1ywt.jpg',
            questionIndex: 1,
            questionType: 'Quiz',
            optionQuestion: 'Single',
            pointType: 'Standard',
            isPublic: true,
            answerTime: 10,
            maxCorrectAnswer: 1,
            answerList: [
                {
                    name: 'a',
                    body: '1',
                    isCorrect: false
                },
                {
                    name: 'b',
                    body: '2',
                    isCorrect: true
                },
                {
                    name: 'c',
                    body: '3',
                    isCorrect: false
                },
                {
                    name: 'd',
                    body: '4',
                    isCorrect: false
                }
            ],
            correctAnswerCount: 1,
            answerCorrect: ['b']
        }
    ],
    numberOfQuestions: 1,
    category: {
        _id: '657bc1c9434552a0913b138e',
        name: 'Math'
    },
    grade: {
        _id: '657bc28d434552a0913b139a',
        name: 'All'
    }
};
