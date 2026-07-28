async function fetchMatches() {
    try {
        const response = await fetch('/api/matches');
        const matches = await response.json();
        
        // ጨዋታዎቹን በ HTML ማሳያ
        displayMatches(matches); 
    } catch (error) {
        console.error('Error:', error);
    }
}

// 1. ገጹ ሲከፈት ወዲያውኑ እንዲያመጣ ጥሪ ማድረግ
fetchMatches();

// 2. በየ 10 ሰከንዱ በራሱ እንዲያድስ ማድረግ
setInterval(fetchMatches, 10000);