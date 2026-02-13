export {trackBackPath, handleKeyPress};

const trackBackPath = (currentPath) =>{
    const lastBackslashIndex = currentPath.lastIndexOf('\\');
    if (lastBackslashIndex === -1) return currentPath;
    return currentPath.slice(0, lastBackslashIndex);
}

const handleKeyPress = (eventKeystring, keysHmap) => {
    const action = keysHmap[eventKeystring];
    if (action) {
        action();
        return true;
    }
    return false;
}