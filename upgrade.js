export const upgradeScripts = [
    function removeOldInvertFeedbackScripts(context, props) {
        var result = {};
        result.updatedFeedbacks = [];
        for (const feedback of props.feedbacks) {
            if (feedback.options['invertRelayState'] !== undefined) {
                feedback.isInverted = !!feedback.options['invertRelayState']
                delete feedback.options['invertRelayState']
                result.updatedFeedbacks.push(feedback)
            }
        }

        result.updatedActions = [];
        result.updatedConfig = null;
        
        return result;
    },
]
