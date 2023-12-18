import Quiz from '../models/quizModel.js';

const findQuizById = async (quizId) => {
    const quiz = await Quiz.findById(quizId)
        .populate('questionList')
        .populate({
            path: 'creator',
            select: ['userName', 'firstName', 'lastName', 'avatar', 'userType']
        })
        .populate({ path: 'grade', select: 'name' })
        .populate({ path: 'category', select: 'name' })
        .lean();

    quiz.questionList = quiz?.questionList.map((question, index) => {
        question.questionIndex = index + 1;
        return question;
    });

    return quiz;
};

const findQuizByCreator = async (creatorId) => {
    try {
        const quizzes = await Quiz.find({ creator: creatorId })
            .populate('questionList')
            .populate({
                path: 'creator',
                select: [
                    'userName',
                    'firstName',
                    'lastName',
                    'avatar',
                    'userType'
                ]
            })
            .populate({ path: 'grade', select: 'name' })
            .populate({ path: 'category', select: 'name' });

        // quizzes.map((quiz) => {
        //     quiz.questionList.map((question, index) => {
        //         question.questionIndex = index + 1;
        //         return question;
        //     });
        //     return quiz;
        // });

        return quizzes;
    } catch (error) {
        console.log(error);
    }
};

export { findQuizById, findQuizByCreator };
