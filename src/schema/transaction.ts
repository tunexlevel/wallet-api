
export const Transfer = () => {
    return {
        sender_wallet_id: {
            exists: {
                errorMessage: 'The sender wallent id is required',
            },
        },
        receiver_wallet_id: {
            exists: {
                errorMessage: 'The receiver wallet id is required',
            },
        },
        amount: {
            exists: {
                errorMessage: 'The amount id is required',
            },
        },
    }
}

export const messageKey = () => {
    return {
        phone_no: {
            exists: {
                errorMessage: 'The phone number is required',
            },
        },
        message: {
            exists: {
                errorMessage: 'The message is required',
            },
        },
        key: {
            exists: {
                errorMessage: 'The api key  is required',
            },
        },
    }
}

export const templateMessage = () => {
    return {
        phone_no: {
            exists: {
                errorMessage: 'The phone number is required',
            },
        },
        message: {
            exists: {
                errorMessage: 'The message is required',
            },
        },
        name: {
            exists: {
                errorMessage: 'The template name is required',
            },
        },
    }
}
