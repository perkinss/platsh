/**
 * This is a helper that splits long sentences into arrays of strings so that it can be displayed properly as
 * a y axis label.  maxWidth is the maximum number of characters to allow.
 * @param sentences an array of sentences to process
 * @param maxWidth
 * @returns {*}
 */
export default function splitSentences(sentences, maxWidth) {
    return sentences.map( sentence => {
        if(sentence.length > maxWidth) {
            let words = sentence.split(" ")
            let clause = words[0]
            let i = 1;
            let result = []
            while (clause.length <= maxWidth && i < words.length) {
                clause = clause + " " + words[i]
                i++
                if (i < words.length && clause.length > maxWidth) {
                    result.push(clause.trim())
                    clause = ""
                }
            }
            result.push(clause.trim())
            return result
        } else {
            return sentence
        }
    })
}