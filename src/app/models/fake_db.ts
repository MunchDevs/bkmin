// 



import { Product, AddonCategory, Addon, Preference, Price, Section, Merchant } from './models'

export class FakeDB {
    prices: Price[] = [
        { size: 'small', price: 0.5 },
        { size: 'medium', price: 1 },
        { size: 'large', price: 1.5 },
        { size: 'x-large', price: 3.0 },
    ]

    addons: Addon[] = [
        { name: 'mayo', required: true, prices: this.prices },
        { name: 'ketchup', required: true, prices: this.prices },
        { name: 'cheese', required: true, prices: this.prices },
        { name: 'egg', required: true, prices: this.prices },
    ]
    addonCategories: AddonCategory[] = [
        { name: 'sides', addons: this.addons, required: true, select_option: 'single' },
        { name: 'drinks', addons: this.addons, required: false, select_option: 'multiple' },
        { name: 'toppings', addons: this.addons, required: true, select_option: 'single' },
        { name: 'extras', addons: this.addons, required: false, select_option: 'multiple' }
    ]


    preferences: Preference[] = [
        { name: 'thin crust', prices: this.prices },
        { name: 'fried', prices: this.prices },
        { name: 'smoked', prices: this.prices }
    ]

    // products: Product[]= [
    //     {  name: "sadza",image_url: '../../../../assets/products/sadza.jpg',available: true,addon_categories: this.addonCategories,preferences: this.preferences, prices: this.prices},
    //     {  name: "pizza",image_url: '../../../../assets/products/pizza.jpg',available: true,addon_categories: this.addonCategories,preferences: this.preferences, prices: this.prices},
    //     {   name: "chicken",image_url: '../../../../assets/products/chicken.jpg',available: true,addon_categories: this.addonCategories,preferences: this.preferences,prices: this.prices},
    //     {   name: "beef",image_url: '../../../../assets/products/beef.jpg',available: true,addon_categories: this.addonCategories,preferences: this.preferences,prices: this.prices},
    //  ]

    sections: Section[] = [
        { name: 'pizzas', icon_name: '009-pizza', products: [] },
        { name: 'teas', icon_name: '045-tea', products: [] },
        { name: 'grill', icon_name: '020-steak', products: [] },
        { name: 'drinks', icon_name: '030-wine glass', products: [] },
    ]


    // merchants: Merchant[] = [
    //     { id: '1', name: 'Galitos', contacts: [{ contact_name: "", phone_no: "" }], logo_url: '../../../../assets/logos/galitos_logo.png', categories: ['', ''], location: [], motto: '', city: 'harare', tags: '', sections: this.sections, banner_url: '', street_address: '1 fife ave', open: true, distance: 1, est_delivery_time: 10, timestamp: 1, cdn_delivery: false, email: "", commission: 2, about: [], country: "" },
    //     { id: '2', name: 'Mc Donalds', contacts: [{ contact_name: "", phone_no: "" }], logo_url: '../../../../assets/logos/mc_donalds_logo.png', categories: ['', ''], location: [], motto: '', city: 'harare', tags: '', sections: this.sections, banner_url: '', street_address: '2 ivernes close', open: true, distance: 1, est_delivery_time: 15, timestamp: 2, cdn_delivery: false, email: "", commission: 2, about: [], country: "" },
    //     { id: '3', name: 'Wimpy', contacts: [{ contact_name: "", phone_no: "" }], logo_url: '../../../../assets/logos/wimpy_logo.gif', categories: ['', ''], location: [], motto: '', city: 'harare', tags: '', sections: this.sections, banner_url: '', street_address: '3 fleming rd', open: true, distance: 1, est_delivery_time: 20, timestamp: 3, cdn_delivery: false, email: "", commission: 2, about: [], country: "" },
    //     { id: '4', name: 'Burger King', contacts: [{ contact_name: "", phone_no: "" }], logo_url: '../../../../assets/logos/burger_king.png', categories: ['', ''], location: [], motto: '', city: 'harare', tags: '', sections: this.sections, banner_url: '', street_address: '4 beins ave', open: true, distance: 1, est_delivery_time: 25, timestamp: 4, cdn_delivery: false, email: "", commission: 2, about: [], country: "" }
    // ]

    // requests:Request[]=[
    //     {   invoice_no:'',
    //         request_type:'',
    //         customer_id: '',
    //         customer_email: '',
    //         customer_name: '',
    //         delivery_distance: 2,
    //         delivery_fee: 3,
    //         delivery_instructions: '',
    //         delivery_address: '',
    //         delivery_location:'',
    //         waypoints:['',''],
    //         items: CartItem[],
    //         restaurant_id: string,
    //         restaurant_name: string,
    //         restaurant_location: string,
    //         restaurant_address: string,
    //         restaurant_contacts: string,
    //         payment_method: string,
    //         preperation_time: string,
    //         stage: string,
    //         //Totals Section
    //         sub_total: number,
    //         total: number,
    //         total_due: number,
    //         rate: any,
    //         currency: number,
    //         cell: string,
    //         app_version: string,
    //         fcm_token: string, }
    // ]

}