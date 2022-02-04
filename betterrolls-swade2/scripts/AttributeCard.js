// Classes for the attribute card

import {BrCard, create_empty_roll_ChatMessage} from "./BrCard.js";

export class BrAttributeCard extends BrCard {
    /**
     * @param {ChatMessage, string, null} message: Message or message id,
     *      null to create it
     */
    constructor(message) {
        super(message, 'attribute');
    }
}

/**
 * This takes care of class creation, we need this because CharMessage needs a roll
 * @return {BrAttributeCard}
 */
export async function create_attribute_class_card() {
    return new BrAttributeCard(await create_empty_roll_ChatMessage())
}