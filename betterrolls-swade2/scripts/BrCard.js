// Base class for the cards
/* globals ChatMessage, game */

import {broofa} from "./utils.js";

class BrCard {
    /**
     * Class constructor
     * @param {ChatMessage, string} message: ChatMessage or message id
     */
    constructor(message) {
        if (message instanceof ChatMessage) {
            this._message = message
            this.message_id = message.id
        } else {
            this._message = undefined
            this.message_id = message
        }
        this.id = broofa()
        this.version = `0-0`
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