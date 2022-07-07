/**** PATH CHECK ****/
let inMap
if (window.location.pathname === '/admin/proposats') {
    inMap = false
}
else if (window.location.pathname === '/admin/publicats') {
    inMap = true
}