export function errorIconByID(error) {
    if (error === 0)
        return './ErrorIcons/NoCheckIcon.png';
    if (error === 1)
        return './ErrorIcons/OkIcon.png';
    if (error === 2 || error === 3)
        return './ErrorIcons/ErrorIcon.png';
    if (error === 4)
        return './ErrorIcons/WarningIcon.png';
    return './ErrorIcons/NoCheckIcon.png';
}
