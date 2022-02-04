// Classes for the attribute card

import {BrCard} from "./BrCard.js";

export class BrAttributeCard extends BrCard {
    /**
     * @param {ChatMessage, string, null} message: Message or message id,
     *      null to create it
     */
    constructor(message) {
        super(message, 'attribute');
    }
}