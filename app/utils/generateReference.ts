

export function generateReference() {
    return "PSA-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

//sample PSA-1799939393-742 - BECOMES THE pesasa transaction ID.