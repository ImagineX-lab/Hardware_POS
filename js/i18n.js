const i18n = {
  si: {
    // General
    currency_symbol: "රු.",
    cancel: "අවලංගු",
    save: "Save කරන්න",
    update: "Update කරන්න",
    delete: "මකන්න",
    close: "වහන්න",
    confirm: "හරි",
    search_placeholder: "සොයන්න...",
    yes: "ඔව්",
    no: "නැහැ",
    all: "ඔක්කොම",

    // Sidebar
    nav_dashboard: "Dashboard",
    nav_sale: "විකිණීම / බිල්",
    nav_items: "Stock",
    nav_purchases: "ගෙන්නන් බිල්",
    nav_stock: "Stock List",
    nav_lowstock: "Stock අඩුයි",
    nav_customers: "ණය ගනු",
    nav_history: "බිල් History",
    nav_settings: "Settings",
    sidebar_msg1: "දත්ත ගබඩා වෙන්නෙ මේ browser එකේ විතරයි.",
    sidebar_msg2: "නිතරම <b>Backup</b> ගන්න.",
    brand_sub: "කඩේ System",

    // Dashboard
    dash_total_items: "Items ගණන",
    dash_item_types: "Item Types",
    dash_low_stock: "Stock අඩු",
    dash_below_reorder: "Reorder limit ළඟින්",
    dash_today_sales: "අද ගනු",
    dash_bills: "බිල්",
    dash_credit_due: "Credit හිඟ",
    dash_customers_count: "ගනුදෙනුකරුවල්",
    dash_low_stock_banner: "බඩුක් Stock ඉවරට ගියා.",
    dash_low_stock_banner_sub: "\"Stock අඩුයි\" tab එකට ගිහිලා බලන්න.",
    dash_low_stock_items: "Stock අඩු බඩු",
    dash_low_stock_sub: "Reorder limit ළඟින් / පහළින් ඇති බඩු",
    dash_item: "බඩු",
    dash_stock: "Stock",
    dash_reorder: "Reorder",
    dash_all_good: "Stock ඔක්කොම හරි",
    dash_recent_sales: "අලුත් ගනු",
    dash_recent_sales_sub: "පසුගිය ගනු",
    dash_date: "දිනය",
    dash_type: "Type",
    dash_amount: "මුදල",
    dash_no_sales: "තාම ගනු නැහැ",

    // Sale
    sale_add_items: "බඩු එකතු කරන්න",
    sale_search_placeholder: "බඩු සොයන්න...",
    sale_cart: "Cart",
    sale_bill: "බිල",
    sale_pay_method: "ගෙවන ක්‍රමය",
    sale_cash: "මුදල් (Cash)",
    sale_credit: "ණයට (Credit)",
    sale_customer: "ගනුදෙනුකරු",
    sale_select_customer: "-- තෝරන්න --",
    sale_discount: "වට්ටම් (රු.)",
    sale_complete_btn: "✔ බිල සම්පූර්ණ කරන්න",
    sale_clear_cart: "Cart එක හිස් කරන්න",
    sale_empty_cart: "Cart එක හිස්",
    sale_empty_cart_sub: "ඉහළින් බඩු එකතු කරන්න",
    sale_no_matches: "ගැලපෙන බඩු නැහැ",
    sale_out_of_stock: "Stock නැහැ!",
    sale_exceeds_stock: "Stock එකට වඩා වැඩියි",
    sale_select_credit_customer: "ණයට දෙන්න Customer කෙනෙක් තෝරන්න",
    sale_success: "බිල සාර්ථකයි! #",

    sale_subtotal: "එකතුව",
    sale_total: "මුළු එකතුව",
    sale_payment: "ගෙවීම",
    sale_amount_paid: "ගෙව්ව මුදල (රු.)",
    sale_change_due: "ඉතිරි (රු.)",

    cart_unit_price: "මිල",
    cart_cost_price: "ගත්ත මිල (Cost)",
    cart_stock: "තොගය",
    cart_qty_label: "ප්‍රමාණය (Qty)",
    cart_discount_label: "වට්ටම (Disc)",

    app_title: "HardwarePOS — කඩේ සිස්ටම්",
    receipt_title: "Hardware Store POS",
    receipt_amount: "මුදල",
    receipt_qty: "ගණන",
    receipt_thanks: "ස්තූතියි! නැවත එන්න.",
    receipt_print: "🖨 ප්‍රින්ට් කරන්න",
    receipt_completed: "බිල ගෙවිලා",

    // Items
    items_list: "බඩු List",
    items_add_btn: "+ බඩු දාන්න",
    items_no_items: "බඩු නැහැ",
    items_no_items_sub: "\"+ බඩු දාන්න\" click කරන්න",
    items_name: "බඩු නම",
    items_category: "Category",
    items_cost_price: "ගත්ත මිල",
    items_sell_price: "ගාස්තු",
    items_status: "Status",
    items_edit: "Edit",

    status_out: "ඉවරයි",
    status_low: "අඩුයි",
    status_ok: "හරි",

    items_form_name: "බඩු නම *",
    items_form_name_ph: "උදා: සිමෙන්ති, 6mm ඇණ",
    items_form_cat: "Category",
    items_form_cat_ph: "උදා: සිමෙන්ති/පයිප්ප/විදුලි",
    items_form_unit: "Unit",
    items_form_reorder: "Reorder Level (Stock අඩු සීමාව)",
    items_form_cost: "ගත්ත මිල (Cost Price)",
    items_form_sell: "ගාස්තු (Sell Price) *",
    items_form_qty: "Stock ගණන (Quantity) *",

    items_err_name: "බඩු නම දාන්න",
    items_err_sell: "ගාස්තු දාන්න",
    items_err_qty: "Stock ගණන දාන්න",
    items_added: "බඩු දාන ලදී",
    items_updated: "බඩු update කරන ලදී",
    items_deleted: "ඉවත් කරන ලදී",
    items_del_confirm: "ඉවත් කරන්නද?",

    // Stock
    stock_report: "Stock List",
    stock_total_val: "Stock Total (cost මිලට):",
    stock_level: "Level",
    stock_value: "Stock වටිනාකම",

    // Low Stock
    ls_title: "Stock අඩු බඩු",
    ls_banner: "බඩු නැවත ගෙන්නන්න.",
    ls_current: "Current Stock",
    ls_add_btn: "+ Stock දාන්න",
    ls_all_normal: "Stock ඔක්කොම හරි",
    ls_no_low: "Stock අඩු බඩු නැහැ",
    ls_add_stock_title: "Stock දාන්න",
    ls_add_qty: "දාන ගණන *",
    ls_err_qty: "නිවැරදි ගණනක් දාන්න",
    ls_updated: "Stock update කෙරුණා",

    // Customers
    cust_title: "ගනු",
    cust_tab_hardwares: "හාර්ඩ්වෙයාර්ස්",
    cust_tab_customers: "සාමාන්‍ය ගනු",
    cust_add_btn: "+ ගනු කෙනෙක් දාන්න",
    cust_no_cust: "ගනු නැහැ",
    cust_no_cust_sub: "\"+ ගනු කෙනෙක් දාන්න\" ක්ලික් කරන්න",
    cust_name: "නම",
    cust_phone: "දුරකථනය",
    cust_address: "ලිපිනය",
    cust_due: "හිඟ මුදල",
    cust_zero: "නැහැ",
    cust_details: "විස්තර",

    cust_form_name: "නම *",
    cust_form_name_ph: "සම්පූර්ණ නම",
    cust_form_phone: "දුරකථනය",
    cust_form_phone_ph: "07XXXXXXXX",
    cust_form_nic: "NIC",
    cust_form_address: "ලිපිනය",
    cust_form_limit: "ණය සීමාව (Credit Limit, රු.) — අවශ්‍ය නැත්නම් හිස් කරන්න",
    cust_form_type: "ගනු ටයිප් *",
    cust_form_discount: "ඩිෆෝල්ට් දිස්කවුන්ට් (%)",
    cust_type_hardware: "හාර්ඩ්වෙයාර් ගනු",
    cust_type_retail: "සාමාන්‍ය ගනු",
    cust_search_ph: "දුරකථනයෙන් හෝ නමින් සොයන්න...",
    cust_quick_add: "+ අලුත් ගනු දාන්න",
    cust_quick_add_title: "අලුත් ගනු දාන්න",
    cust_hardware_discount_badge: "හාර්ඩ්වෙයාර් දිස්කවුන්ට්",
    cust_payment_amount: "මුදල (රු.)",
    cust_err_name: "නම දාන්න",
    cust_added: "ගනු දාන ලදී",

    cust_curr_due: "දැන් හිඟ",
    cust_record_payment_title: "ගෙවීමක් දාන්න",
    cust_record_payment_btn: "ගෙවීම සේව් කරන්න",
    cust_history: "ගනු ඉතිහාසය",
    cust_history_empty: "ගනු නැහැ",
    cust_type_sale: "ණයට දීම",
    cust_type_pay: "ගෙවීම",
    cust_err_amt: "නිවැරදි මුදලක් දාන්න",
    cust_pay_recorded: "ගෙවීම සේව් කෙරුණා",
    cust_err_del_due: "හිඟ ගනු කෙනෙකු මකන්න බෑ",

    // History
    hist_title: "බිල් ඉතිහාසය",
    hist_filter_all: "ඔක්කොම",
    hist_filter_cash: "කෑෂ් විතරක්",
    hist_filter_credit: "ණයට විතරක්",
    hist_no_sales: "ගනු නැහැ",
    hist_items: "බඩු",
    hist_del_title: "අවලංගු",
    hist_del_confirm: "මේ බිල අවලංගු කරන්නද? ස්ටොක් සහ ණය ශේෂය නැවත ගැලපෙයි.",
    hist_deleted: "බිල අවලංගු කෙරුණා",

    // Settings
    settings_title: "සෙටිංස්",
    settings_shop_details: "කඩේ තොරතුරු",
    settings_shop_name: "කඩේ නම",
    settings_backup_title: "Backup",
    settings_backup_sub: "දත්ත ගබඩා වෙන්නෙ මේ browser එකේ විතරයි. Computer එකක් වෙනස් වුණොත් හෝ browser data clear කළොත් ඔක්කොම යයි — නිතරම backup ගන්න.",
    settings_export_btn: "⬇ Backup Download",
    settings_restore_lbl: "Backup restore කරන්න",
    settings_wipe_btn: "⚠ ඔක්කොම මකන්න",
    settings_saved: "සේව් කෙරුණා",
    settings_backup_dl: "Backup ගත්තා",
    settings_restore_confirm: "Backup restore කළොත් දැන් ඇති ඔක්කොම යයි. ඉදිරියට යන්නද?",
    settings_restore_ok: "Restore හරි",
    settings_restore_err: "Backup file එක හරිනැහැ",
    settings_wipe_confirm: "ඔක්කොම බඩු, ගනු සහ ගනු ස්ථිරවම මකන්නද? මෙය නැවත ගන්න බෑ!",
    settings_wiped: "ඔක්කොම මකා දමන ලදී",

    // Other short words
    word_credit: "Credit",
    word_cash: "Cash",
    word_due: "හිඟ",
    word_qty: "Stock",
    word_type: "Type",
    notif_title: "නිවේදන",
    notif_empty: "සියලුම තොග සීමාවන් යහපත් මට්ටමේ පවතී!",
    notif_low_stock: "Stock අඩුයි!",
    notif_current: "දැන් තියෙන්නේ",
    notif_reorder: "Reorder සීමාව"
  },

  en: {
    // General
    currency_symbol: "Rs.",
    cancel: "Cancel",
    save: "Save",
    update: "Update",
    delete: "Delete",
    close: "Close",
    confirm: "Confirm",
    search_placeholder: "Search...",
    yes: "Yes",
    no: "No",
    all: "All",

    // Sidebar
    nav_dashboard: "Dashboard",
    nav_sale: "Sales / Billing",
    nav_items: "Items",
    nav_stock: "Stock Report",
    nav_lowstock: "Low Stock",
    nav_customers: "Credit Customers",
    nav_history: "Sales History",
    nav_settings: "Settings / Backup",
    sidebar_msg1: "Data is stored locally in this browser.",
    sidebar_msg2: "Take a <b>Backup</b> frequently.",
    brand_sub: "Store Management",

    // Dashboard
    dash_total_items: "Total Items",
    dash_item_types: "Item Types",
    dash_low_stock: "Low Stock",
    dash_below_reorder: "Below Reorder Level",
    dash_today_sales: "Today's Sales",
    dash_bills: "Invoices",
    dash_credit_due: "Credit Dues",
    dash_customers_count: "Customers",
    dash_low_stock_banner: "items are low on stock.",
    dash_low_stock_banner_sub: "Check the \"Low Stock\" page to restock.",
    dash_low_stock_items: "Low Stock Items",
    dash_low_stock_sub: "Items near or below reorder level",
    dash_item: "Item",
    dash_stock: "Stock",
    dash_reorder: "Reorder",
    dash_all_good: "All stock levels are normal",
    dash_recent_sales: "Recent Sales",
    dash_recent_sales_sub: "Latest transactions",
    dash_date: "Date",
    dash_type: "Type",
    dash_amount: "Amount",
    dash_no_sales: "No sales yet",

    // Sale
    sale_add_items: "Add Items",
    sale_search_placeholder: "Search an item... (e.g., Cement, Nails, Pipes)",
    sale_cart: "Cart",
    sale_bill: "Invoice",
    sale_pay_method: "Payment Method",
    sale_cash: "Cash",
    sale_credit: "Credit",
    sale_customer: "Customer",
    sale_select_customer: "-- Select --",
    sale_discount: "Discount (Rs.)",
    sale_complete_btn: "✔ Complete Sale",
    sale_clear_cart: "Clear Cart",
    sale_empty_cart: "Cart is empty",
    sale_empty_cart_sub: "Add items using the search above",
    sale_no_matches: "No matching items",
    sale_out_of_stock: "Out of stock!",
    sale_exceeds_stock: "Selected quantity exceeds available stock",
    sale_select_credit_customer: "Select a customer for credit sales",
    sale_success: "Sale completed! #",

    sale_subtotal: "Subtotal",
    sale_total: "Total",
    sale_payment: "Payment",
    sale_amount_paid: "Amount Paid (Rs.)",
    sale_change_due: "Change Due (Rs.)",

    cart_unit_price: "Price",
    cart_cost_price: "Cost",
    cart_stock: "Stock",
    cart_qty_label: "Qty",
    cart_discount_label: "Disc",

    app_title: "HardwarePOS — Store POS",
    receipt_title: "Hardware Store POS",
    receipt_amount: "Amount",
    receipt_qty: "Qty",
    receipt_thanks: "Thank you! Come again.",
    receipt_print: "🖨 Print Receipt",
    receipt_completed: "Transaction Completed",

    // Items
    items_list: "Item List",
    items_add_btn: "+ Add an Item",
    items_no_items: "No Items",
    items_no_items_sub: "Click \"+ Add an Item\"",
    items_name: "Item",
    items_category: "Category",
    items_cost_price: "Cost Price",
    items_sell_price: "Selling Price",
    items_status: "Status",
    items_edit: "Edit",

    status_out: "Out",
    status_low: "Low",
    status_ok: "OK",

    items_form_name: "Item Name *",
    items_form_name_ph: "e.g., Cement, 6mm Nails",
    items_form_cat: "Category",
    items_form_cat_ph: "e.g., Cement/Pipes/Electrical",
    items_form_unit: "Unit",
    items_form_reorder: "Reorder Level",
    items_form_cost: "Cost Price",
    items_form_sell: "Selling Price *",
    items_form_qty: "Current Quantity *",

    items_err_name: "Item name is required",
    items_err_sell: "Selling price is required",
    items_err_qty: "Quantity is required",
    items_added: "Item added successfully",
    items_updated: "Item updated successfully",
    items_deleted: "Item deleted",
    items_del_confirm: "delete this item?",

    // Stock
    stock_report: "Stock Report",
    stock_total_val: "Total Stock Value (at cost):",
    stock_level: "Level",
    stock_value: "Stock Value",

    // Low Stock
    ls_title: "Low Stock Items",
    ls_banner: "items need to be restocked.",
    ls_current: "Current Stock",
    ls_add_btn: "+ Add Stock",
    ls_all_normal: "All stock levels are normal",
    ls_no_low: "No low stock items",
    ls_add_stock_title: "Add Stock",
    ls_add_qty: "Quantity to add *",
    ls_err_qty: "Enter a valid quantity",
    ls_updated: "Stock updated successfully",

    // Customers
    cust_title: "Customers",
    cust_tab_hardwares: "Hardwares",
    cust_tab_customers: "Retail Customers",
    cust_add_btn: "+ Add a Customer",
    cust_no_cust: "No Customers",
    cust_no_cust_sub: "Click \"+ Add a Customer\"",
    cust_name: "Name",
    cust_phone: "Phone",
    cust_address: "Address",
    cust_due: "Due Amount",
    cust_zero: "Zero",
    cust_details: "Details",

    cust_form_name: "Name *",
    cust_form_name_ph: "Full Name",
    cust_form_phone: "Phone Number",
    cust_form_phone_ph: "07XXXXXXXX",
    cust_form_nic: "NIC Number",
    cust_form_address: "Address",
    cust_form_limit: "Credit Limit (Rs.) - Optional",
    cust_form_type: "Customer Type *",
    cust_form_discount: "Default Discount (%)",
    cust_type_hardware: "Hardware Client",
    cust_type_retail: "Retail Customer",
    cust_search_ph: "Search by Mobile Number or Name...",
    cust_quick_add: "+ Add New Customer",
    cust_quick_add_title: "Add New Customer",
    cust_hardware_discount_badge: "Hardware Discount",
    cust_payment_amount: "Amount (Rs.)",
    cust_err_name: "Name is required",
    cust_added: "Customer added successfully",

    cust_curr_due: "Current Due",
    cust_record_payment_title: "Record a Payment",
    cust_record_payment_btn: "Record Payment",
    cust_history: "Transaction History",
    cust_history_empty: "No transactions yet",
    cust_type_sale: "Credit Sale",
    cust_type_pay: "Payment",
    cust_err_amt: "Enter a valid amount",
    cust_pay_recorded: "Payment recorded successfully",
    cust_err_del_due: "Cannot delete a customer with pending dues",

    // History
    hist_title: "Sales History",
    hist_filter_all: "All",
    hist_filter_cash: "Cash Only",
    hist_filter_credit: "Credit Only",
    hist_no_sales: "No sales",
    hist_items: "Items",
    hist_del_title: "Cancel Sale",
    hist_del_confirm: "Cancel this sale? Stock and credit balances will be restored.",
    hist_deleted: "Sale cancelled successfully",

    // Settings
    settings_title: "Settings",
    settings_shop_details: "Shop Details",
    settings_shop_name: "Shop Name",
    settings_backup_title: "Data Backup",
    settings_backup_sub: "Data is stored only in this browser. If you change devices or clear browser data, it will be lost — download a backup regularly.",
    settings_export_btn: "⬇ Download Backup (.json)",
    settings_restore_lbl: "Restore a Backup",
    settings_wipe_btn: "⚠ Wipe All Data",
    settings_saved: "Saved successfully",
    settings_backup_dl: "Backup file downloaded",
    settings_restore_confirm: "Restoring a backup will replace all current data. Proceed?",
    settings_restore_ok: "Data restored successfully",
    settings_restore_err: "Invalid backup file",
    settings_wipe_confirm: "Permanently delete all items, customers, and sales? This cannot be undone!",
    settings_wiped: "All data wiped successfully",

    // Other short words
    word_credit: "Credit",
    word_cash: "Cash",
    word_due: "Due",
    word_qty: "Qty",
    word_type: "Type",
    notif_title: "Notifications",
    notif_empty: "All stock levels are normal!",
    notif_low_stock: "Low stock alert!",
    notif_current: "Current stock",
    notif_reorder: "Reorder limit"
  }
};

let currentLang = localStorage.getItem('pos_lang') || 'si';

function t(key) {
  if (!i18n[currentLang] || !i18n[currentLang][key]) {
    return key; // return key if missing translation
  }
  return i18n[currentLang][key];
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('pos_lang', lang);
  updateStaticTranslations();
  updateLangButtons();
  if (typeof App !== 'undefined' && App.updateTitles) {
    App.updateTitles();
    App.render();
  }
}

function updateLangButtons() {
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('lang-active', btn.dataset.langBtn === currentLang);
  });
}

function updateStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.title = t('app_title');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const icon = el.querySelector('.nav-ico');
    const badge = el.querySelector('.badge-count');

    if (icon) {
      let html = icon.outerHTML + ' <span class="nav-text">' + t(key) + '</span>';
      if (badge) html += ' ' + badge.outerHTML;
      el.innerHTML = html;
    } else {
      el.innerHTML = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
}

// Call once on load for static translations
document.addEventListener('DOMContentLoaded', () => {
  updateStaticTranslations();
  updateLangButtons();
});
