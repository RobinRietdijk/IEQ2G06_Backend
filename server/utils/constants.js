export const NODE_ENV = process.env.NODE_ENV;
export const UPS = process.env.UPS || '1';
export const URL = NODE_ENV == 'development' ? `http://localhost:${process.env.PORT || 3000}` : 'https://oracle-api.rjrietdijk.com'

export const ROUTES = {
    INDEX: '/',
    CARD: '/card',
    GPT: '/gpt'
}

export const EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NODE_CONNECT: 'node_connect',
    NODE_CONNECTED: 'node_connected',
    NODE_DATA: 'node_data',
    NODE_ACTIVATED: 'node_activated',
    SYSTEM_DATA: 'system_data',
    SYSTEM_STATE: 'system_state',
    SYSTEM_CONCLUDE: 'system_conclude',
    PRINT: 'print',
    PRINT_COMPLETE: 'print_complete',
    PRINTER_CONNECT: 'printer_connect',
    ERROR: 'error',
}

export const ROOMS = {
    SPECTATOR: 'spectator',
    PRINTER: 'printer'
}

export const STATES = {
    IDLE: 'idle',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PROMPTING: 'prompting',
    PRINTING: 'printing',
    ERROR: 'error'
}

export const PROMPT = (color, time, weather, location) => {
    return `
    Based on the given ranges:
    Use Adjectives that describe the following colour: ${color}. 
    Write a poem.
    The poem has 6 lines. Every line has a maximum of 5 words.
    Write in the style of a fortune reading.
    Use less corporate jargon. Use a conversational tone. Use poetic, beautiful words.
    Use the following information to write the poem:
    - The colour: ${color}
    - The time: ${time}
    - The weather: ${weather}
    - The location: ${location}
    Forbidden words: "${color}", "${weather}", "Admidst", "Hue".
    Make the last sentence an incitement.
    `
}

export const PROMPT_no_weather = (color, time, location) => {
    return `
    Based on the given ranges:
    Use Adjectives that describe the following colour: ${color}. 
    Write a poem.
    The poem has 6 lines. Every line has a maximum of 5 words.
    Write in the style of a fortune reading.
    Use less corporate jargon. Use a conversational tone. Use poetic, beautiful words.
    Use the following information to write the poem:
    - The colour: ${color}
    - The time: ${time}
    - The location: ${location}
    Forbidden words: "${color}", "Admidst", "Hue".
    Make the last sentence an incitement.
    `
}