
interface timestamp {
    timestamp: number
}

export interface Merchant extends timestamp {
    id?: string,
    name: string,
    email: string, //added
    contacts: Contact[],  //modified
    logo_url: string,
    bussiness_hours?: Bussiness_Hours,
    categories: string[],
    location: number[],
    commission: number,
    about: string[],
    motto: string,
    city: string,
    country: string,
    tags: string,
    sections: Section[],
    banner_url: string,
    street_address: string,
    open: boolean,
    distance: number,
    est_delivery_time: number,
    cdn_delivery: boolean

}

export interface Bussiness_Hours {
    monday: Operation_times,
    tuesday: Operation_times,
    wednesday: Operation_times,
    thursday: Operation_times,
    friday: Operation_times,
    saturday: Operation_times,
    sunday: Operation_times
}

export interface Operation_times {
    opens: string,
    closes: string
}


export interface Contact {
    contact_name: string,
    phone_no: string,
}


export interface Section {
    name: string,
    icon_name: string,
    products: Product[]
}

export interface Price {
    size: string,
    price: number
}

export interface Preference {
    name: string,
    prices: Price[]
}

export interface Addon {
    name: string,
    required: boolean,
    prices: Price[]
}

export interface AddonCategory {
    name: string,
    addons: Addon[]
    required: boolean,
    select_option: string
}

export interface Product {

    name: string,
    description: string,
    image_url: string,
    available: boolean,
    addon_categories: AddonCategory[],
    preferences: Preference[],
    prices: Price[],

}

export interface User {
    id: string,
    name: string,
    avatar_url: string,
    email: string,
    phone: string,
    addresses: any[],
    username: string,
    password: string

}

export interface CartItemAddon {
    name: string,
    price: number,
    size: string
}

export interface CartItemPreference {
    name: string,
    price: number,
}


export interface CartItem {
    name: string,
    image_url: string,
    addons: CartItemAddon[],
    quantity: number,
    size: string,
    item_total_price: number,
    preferences: CartItemPreference,
    specifications: string,
    merchant_id: string,
    merchant_name: string
}

//same as order
export interface Request extends timestamp {
    invoice_no: string,
    request_type: string,
    booked_time: number,
    booked_for: number,
    driver: Driver,
    customer_id: string,
    customer_email: string,
    customer_name: string,
    customer_phone: string,
    delivery_distance: number,
    delivery_fee: number,
    delivery_info: DeliveryInfo,
    // delivery_instructions: string,
    // delivery_address: any,
    // delivery_location: any,
    waypoints: any[],
    items: CartItem[],
    merchants: Merchants[],
    merchant_ids: string[],
    payment_method: string,
    preperation_time: number,
    stage: string,
    //Totals Section
    sub_total: number,
    total: number,
    total_due: number,
    rate: any,
    currency: number,
    app_version: string,
    fcm_token: string,
    cdn_delivery: boolean
}

//Requests segments types
export interface RequestTotals {
    sub_total: number,
    delivery_distance: number,
    delivery_fee: number,
    total: number,
    cal: any
}

export interface RequestDelivery {
    delivery_distance: number,
    delivery_fee: number,
    delivery_instructions: string,
    delivery_address: string,
    delivery_location: any
}



export interface Merchants {
    merchant_id: string,
    merchant_name: string,
    merchant_location: string,
    merchant_address: string,
    merchant_contacts: any[],

}

export interface DeliveryInfo {
    full_name: string,
    phone_number: string,
    house_flat_number: string,
    suburb: string,
    city: string,
    country: string,
    instructions: string,
    location: any,
}


export interface Driver {
    id: string,
    id_no: string,
    name: string,
    phone_number: string,
    reg_no: string,
    vehicle_reg: string,
    occupied: boolean
}

export interface Tier {
    charge: number,
    max: number,
    min: number
}












