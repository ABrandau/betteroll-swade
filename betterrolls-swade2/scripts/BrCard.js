// Base class for the cards
/* globals ChatMessage, game, CONST, Roll, renderTemplate */

import {broofa, getWhisperData} from "./utils.js";
export class BrCard {
    /**
     * Class constructor
     * @param {ChatMessage, string} message: ChatMessage or message id
     * @param {string} type: String that defines the type of Card (class)
     */
    constructor(message, type) {
        if (message instanceof ChatMessage) {
            this._message = message
            this.message_id = message.id
        } else {
            this._message = game.messages.get(message)
            this.message_id = message
        }
        let flags = this._message.getFlag('betterrolls-swade2',
            'br-card-data')
        this.template = '/modules/betterrolls-swade2/templates/class_card.html'
        // If flags we are re-creating from a stored card else really new
        if (flags) {
            this.update_from_card()
        } else {
            this.id = broofa()
            this.version = `0-0`
            this.type = type || 'base'
            this.init_ChatMessage()
        }
        game.brsw.card_hash[this.id] = this
    }

    /**
     * Creates a new Foundry ChatMessage
     */
    async init_ChatMessage() {
        let messageData = {
            id: this.message_id,
            content: await this.render_content(),
            speaker: {
                actor: '',
                token: '',
                alias: origin.name
            },
            flags: {'betterrolls-swade2': {'br-card-data':
                        this.as_simple_object()}},
        }
        this._message.update(messageData)
    }

    /**
     * Gets the Foundry Chat Message attached to this class
     */
    get_message() {
        if (! this._message) {
            this._message = game.message.get(this.message_id)
        }
        return this._message
    }

    /**
     * Stores this class data into a message flag
     */
    async save() {
        this.update_version()
        const message = this.get_message()
        await message.setFlag('betterrolls-swade2', 'br-card-data',
            this.as_simple_object())
        message.render(true)
    }

    /**
     * Returns a simple object with just this class basic data usable to
     * store into a Foundry object as a flag
     */
    as_simple_object(){
        return {'id': this.id, 'version': this.version,
            'message_id': this.message_id, 'type': this.type}
    }

    /**
     * Updates the version number
     */
    update_version() {
        const number = this.version? parseInt(this.version.split('-')[1]) : 0
        this.version = `${Date.now()}-${number + 1}`
    }

    /**
     * Updates this class from the data stored in the Foundry card
     */
    update_from_card() {
        const data = this.get_message().getFlag('betterrolls-swade2',
            'br-card-data')
        this.id = data.id
        this.version = data.version
        this.type = data.type || 'base'
    }

    /**
     * Renders the content of the message.
     */
    async render_content(){
        return await renderTemplate(this.template, {});
    }
}

/**
 * This function creates an empty card to be used as a template
 * @return {ChatMessage}
 */
export async function create_empty_roll_ChatMessage() {
    const empty_roll = new Roll("0").roll({async: false})
    const whisper_data = getWhisperData();
    let chatData = {
        user: game.user.id,
        content: '<p>Default content, likely an error in Better Rolls</p>',
        blind: whisper_data.blind,
        roll: empty_roll,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rollMode: whisper_data.rollMode
    }
    if (whisper_data.whisper) {
        chatData.whisper = whisper_data.whisper
    }
    return ChatMessage.create(chatData);
}