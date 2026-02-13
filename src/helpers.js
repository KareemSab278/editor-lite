export {trackBackPath, handleKeyPress};

const trackBackPath = (currentPath) =>{
    // C:\Users\coinadrink\Desktop -> C:\Users\coinadrink
    const lastBackslashIndex = currentPath.lastIndexOf('\\');
    if (lastBackslashIndex === -1) return currentPath;
    return currentPath.slice(0, lastBackslashIndex);
}

const handleKeyPress = (eventKeystring, keysHmap) => {
    return keysHmap[eventKeystring] || null;
}