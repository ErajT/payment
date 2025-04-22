const Qexecution = require("./query");

exports.payFastNotify = async (req, res) => {
    try {
        const {
            pf_payment_id,
            payment_status,
            amount_gross,
            item_name
        } = req.body;

        // Basic verification (real implementation should verify signature from PayFast too)
        if (payment_status !== "COMPLETE") {
            return res.status(400).send("Payment not completed");
        }

        const projectMatch = item_name.match(/Project #(\d+)/);
        const sprintMatch = item_name.match(/Sprint #(\d+)/);

        const projectID = projectMatch ? parseInt(projectMatch[1]) : null;
        const sprintID = sprintMatch ? parseInt(sprintMatch[1]) : null;

        if (!projectID || !sprintID) {
            return res.status(400).send("Invalid item_name format");
        }

        await Qexecution.queryExecute(
            `UPDATE payments 
             SET status = 'paid', payfast_ref = ?
             WHERE projectID = ? AND sprintID = ? AND amount = ?`,
            [pf_payment_id, projectID, sprintID, amount_gross]
        );

        return res.send("Payment processed successfully");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error processing payment");
    }
};