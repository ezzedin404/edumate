
const STUDENT_HISTORY_SERVICE_URL = ""
const EVALUATION_SERVICE_URL = ""

export const deleteCourseProgresses = async (courseId: number) => {
    const response = await fetch(`${STUDENT_HISTORY_SERVICE_URL}/api/v1/progresses?courseId=${courseId}`, {
        method: "DELTE"
    })
    if (!response.ok) throw new Error();
}

export const deleteLectureAnswers = async (lectureId: number) => {
    const response = await fetch(`${STUDENT_HISTORY_SERVICE_URL}/api/v1/answers?lectureId=${lectureId}`, {
        method: "DELTE"
    })
    if (!response.ok) throw new Error();
}

export const deleteLectureQuestions = async (lectureId: number) => {
    const response = await fetch(`${EVALUATION_SERVICE_URL}/api/v1/wqs?lectureId=${lectureId}`, {
        method: "DELTE"
    })
    const response2 = await fetch(`${EVALUATION_SERVICE_URL}/api/v1/msqs?lectureId=${lectureId}`, {
        method: "DELTE"
    })
    if (!response.ok) throw new Error();
}