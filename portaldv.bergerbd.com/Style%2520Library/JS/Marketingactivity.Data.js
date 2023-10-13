const services = [
    { value: '', label: '-- Select Service --' },
    { value: 'TV Media', label: 'TV Media' },
    { value: 'TV Production and TVC', label: 'TV Production and TVC' },
    { value: 'Redio Media', label: 'Redio Media' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Sponsorship', label: 'Sponsorship' },
    { value: 'Press Ad', label: 'Press Ad' },
    { value: 'Outdoor Billboard, Wall and Shutter Painting', label: 'Outdoor Billboard, Wall and Shutter Painting' },
    { value: 'Shop Sign and Decoration', label: 'Shop Sign and Decoration' },
    { value: 'Software Development and Other', label: 'Software Development and Other' },
    { value: 'Corporate Marketing Service', label: 'Corporate Marketing Service' },
    { value: 'Market Research - Retail Audit', label: 'Market Research - Retail Audit' },
    { value: 'Market Research', label: 'Market Research' },
    { value: 'Scratch card, Mobile SMS, Recharge Service', label: 'Scratch card, Mobile SMS, Recharge Service' },
    { value: 'Dealer Shop Merchandising', label: 'Dealer Shop Merchandising' },
    { value: 'Event Management (Art, Competition, Awards, Daily Star Anniversary)', label: 'Event Management (Art, Competition, Awards, Daily Star Anniversary)' },
    { value: 'Consumer Promotion- Activation', label: 'Consumer Promotion- Activation' },
    { value: 'Fair and Exhibition', label: 'Fair and Exhibition' },
    { value: 'Pack Design & Creative', label: 'Pack Design & Creative' },
    { value: 'Franchise Expense-Experience Zone', label: 'Franchise Expense-Experience Zone' },
    { value: 'Umbrella - courier', label: 'Umbrella - courier' },
    { value: 'Shomporko Club scheme', label: 'Shomporko Club scheme' },
    { value: 'PTI service', label: 'PTI service' }
];

const activityTypes = [
    { value: '', label: '-- Select Activity Type --' },
    { value: 'One Time', label: 'One Time' },
    { value: 'Monthly Recurring', label: 'Monthly Recurring' }
];

const budgetTypes = [
    { value: '', label: '-- Select Budget Type --' },
    { value: 'Available Budget', label: 'Available Budget' },
    { value: 'Need to Transfer', label: 'Need to Transfer' },
    { value: 'Supplementary', label: 'Supplementary' }
];

const brands = [
    { value: '', label: '-- Select Brand Description --' },
    { value: 'Adhesive -Power Bond', label: 'Adhesive -Power Bond' },
    { value: 'Adhesive -Tex Bond', label: 'Adhesive -Tex Bond' },
    { value: 'APE', label: 'APE' },
    { value: 'Auto Refinish', label: 'Auto Refinish' },
    { value: 'Berger Experience Zone (Decorative)', label: 'Berger Experience Zone (Decorative)' },
    { value: 'BREATHE EASY', label: 'BREATHE EASY' },
    { value: 'BREATHE EASY Ena', label: 'BREATHE EASY Ena' },
    { value: 'Color Bank', label: 'Color Bank' },
    { value: 'Corporate Brand', label: 'Corporate Brand' },
    { value: 'Damp Guard', label: 'Damp Guard' },
    { value: 'Decorative', label: 'Decorative' },
    { value: 'DUROCEM', label: 'DUROCEM' },
    { value: 'EASY CLEAN', label: 'EASY CLEAN' },
    { value: 'EP Tools (Express Painting)', label: 'EP Tools (Express Painting)' },
    { value: 'Express Painting Service', label: 'Express Painting Service' },
    { value: 'Home Décor Branding', label: 'Home Décor Branding' },
    { value: 'Industrial Paints', label: 'Industrial Paints' },
    { value: 'INNOVA', label: 'INNOVA' },
    { value: 'JHILIK', label: 'JHILIK' },
    { value: 'LS. Metallic Finish', label: 'LS. Metallic Finish' },
    { value: 'LSE', label: 'LSE' },
    { value: 'Marine Paints', label: 'Marine Paints' },
    { value: 'Mr.EXPERT DAMP GUARD', label: 'Mr.EXPERT DAMP GUARD' },
    { value: 'Painters App', label: 'Painters App' },
    { value: 'Powder Coating', label: 'Powder Coating' },
    { value: 'PRE TREATMENT CHEM', label: 'PRE TREATMENT CHEM' },
    { value: 'Printing Ink', label: 'Printing Ink' },
    { value: 'REX', label: 'REX' },
    { value: 'RIN', label: 'RIN' },
    { value: 'ROBB WALL PUTTY', label: 'ROBB WALL PUTTY' },
    { value: 'ROBB WATER SEALER', label: 'ROBB WATER SEALER' },
    { value: 'RSE', label: 'RSE' },
    { value: 'Salt Safe', label: 'Salt Safe' },
    { value: 'SPD', label: 'SPD' },
    { value: 'Touch putty (Decorative)', label: 'Touch putty (Decorative)' },
    { value: 'Value Club App, LMS, Happy Wallet, MR/VR', label: 'Value Club App, LMS, Happy Wallet, MR/VR' },
    { value: 'Vehicle Refinish', label: 'Vehicle Refinish' },
    { value: 'W/C ANTIDIRT', label: 'W/C ANTIDIRT' },
    { value: 'W/C ANTIDIRT LONGLIF', label: 'W/C ANTIDIRT LONGLIF' },
    { value: 'W/C ANTIDIRT LONGLIFE (F167)', label: 'W/C ANTIDIRT LONGLIFE (F167)' },
    { value: 'W/C Antidirt Supreme (F168)', label: 'W/C Antidirt Supreme (F168)' },
    { value: 'W/C EXTERIOR SEALER', label: 'W/C EXTERIOR SEALER' },
    { value: 'W/C SMOOTH', label: 'W/C SMOOTH' },
    { value: 'WC GLOW', label: 'WC GLOW' },
    { value: 'WEATHER COAT EXTERIOR SEALER', label: 'WEATHER COAT EXTERIOR SEALER' },
    { value: 'Wood Coating / Innova', label: 'Wood Coating / Innova' },
    { value: 'WOOD KEEPER', label: 'WOOD KEEPER' },
    { value: 'Xpress Sealer (Decorative)', label: 'Xpress Sealer (Decorative)' }
];
const commitmentItems = [
    { value: '', label: '-- Select Commitment Item --' },
    { value: 'Con Pro_Campaign Actv Cost', label: 'Con Pro_Campaign Actv Cost' },
    { value: 'Corporate - Other', label: 'Corporate - Other' },
    { value: 'PTI Gift', label: 'PTI Gift' },
    { value: 'SC Production Cost', label: 'SC Production Cost' },
    { value: 'Shomporko Scheme_On invoice', label: 'Shomporko Scheme_On invoice' },
    { value: 'Mass Calendar Production', label: 'Mass Calendar Production' },
    { value: 'Exec. Diary Prod.', label: 'Exec. Diary Prod.' },
    { value: 'Small Diary Prod.', label: 'Small Diary Prod.' },
    { value: 'Shade Card Mgt', label: 'Shade Card Mgt' },
    { value: 'POSM Print', label: 'POSM Print' }
];
const vendorQuotations = [
    { value: '', label: '-- Select Required Vendor Quotation --' },
    { value: 'Minimum 3 parties', label: 'Minimum 3 parties' },
    { value: 'Single Vendor', label: 'Single Vendor' }
];