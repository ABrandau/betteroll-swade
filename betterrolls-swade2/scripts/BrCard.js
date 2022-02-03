// Base class for the cards
/* globals ChatMessage, game, CONST, Roll */

import {broofa, getWhisperData} from "./utils.js";
export class BrCard {
    /**
     * Class constructor
     * @param {ChatMessage, string, null} message: ChatMessage or message id
     */
    constructor(message) {
        if (message instanceof ChatMessage) {
            this._message = message
            this.message_id = message.id
            if (! this._message.data.flags['betterrolls-swade2']?.type) {
                this.init_ChatMessage()
            }
        } else {
            this._message = undefined
            this.message_id = message
        }
        this.id = broofa()
        this.version = `0-0`
        game.brsw.card_hash[this.id] = this
    }

    /**
     * Creates a new Foundry ChatMessage
     */
    init_ChatMessage() {
        const whisper_data = getWhisperData();
        let messageData = {
            id: this.message_id,
            user: game.user.id,
            content: '<p>Default content, likely an error in Better Rolls</p>',
            speaker: {
                actor: '',
                token: '',
                alias: origin.name
            },
//            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            blind: whisper_data.blind,
            flags: {'betterrolls-swade2': {type: 'BrBaseClass'}},
//            roll: new Roll("0"),
//            rollMode: whisper_data.rollMode
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
            this.as_simple_object)
    }

    /**
     * Returns a simple object with just this class basic data usable to
     * store into a Foundry object as a flag
     */
    as_simple_object(){
        return {'id': this.id, 'version': this.version,
            'message_id': this.message_id}
    }

    /**
     * Updates the version number
     */
    update_version() {
        const number = this.version? parseInt(this.version.split('-')[1]) : 0
        this.version = `${Date.now()}-${number}`
    }

    /**
     * Updates this class from the data stored in the Foundry card
     */
    update_from_card() {
        const data = this.get_message().getFlag('betterrolls-swade2',
            'br-card-data')
        this.id = data.id
        this.version = data.version
    }
}