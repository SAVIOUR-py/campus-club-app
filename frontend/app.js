/**
 * ICT251 Web Technologies — Lab 4
 * Frontend AJAX Controller Module
 * Handles all async FETCH API network request calls to our Node backend server.
 */

// Base endpoint configuration matching our running Express API server port mapping
const API_URL = 'http://localhost:5000/api/clubs';

// DOM Elements Cache
const clubForm = document.getElementById('club-form');
const clubIdInput = document.getElementById('club-id');
const nameInput = document.getElementById('name');
const presidentInput = document.getElementById('president');
const categoryInput = document.getElementById('category');
const memberCountInput = document.getElementById('member_count');
const descriptionInput = document.getElementById('description');
const rosterList = document.getElementById('roster-list');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Fire initial data load sequence when browser tree maps load up safely
document.addEventListener('DOMContentLoaded', fetchClubRoster);

// ==========================================
// ACTION: READ - Fetch and Render the Roster
// ==========================================
async function fetchClubRoster() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network failure while fetching profiles.');
        
        const clubs = await response.json();
        
        // Wipe out any stale layouts inside our container
        rosterList.innerHTML = '';

        if (clubs.length === 0) {
            rosterList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No campus clubs registered yet. Use the form above to add one!</p>';
            return;
        }

        // Run map layout iteration loops to generate profile blocks dynamically
        clubs.forEach(club => {
            const card = document.createElement('div');
            card.className = 'club-card';
            
            card.innerHTML = `
                <div>
                    <h3 class="club-title">${escapeHTML(club.name)}</h3>
                    <div class="club-meta"><strong>Leader:</strong> ${escapeHTML(club.president)}</div>
                    <div class="club-meta"><strong>Category:</strong> ${escapeHTML(club.category)}</div>
                    <div class="club-meta"><strong>Members:</strong> ${club.member_count} active</div>
                    <p class="club-desc">${escapeHTML(club.description || 'No description provided.')}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-sm" onclick="prepareUpdate(${JSON.stringify(club).replace(/"/g, '&quot;')})">✏️ Edit</button>
                    <button class="btn-sm btn-delete" onclick="deleteClubProfile(${club.id})">🗑️ Delete</button>
                </div>
            `;
            rosterList.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        rosterList.innerHTML = `<p style="color: red; text-align: center;">Error loading active profile list: ${err.message}</p>`;
    }
}

// ==========================================
// ACTION: CREATE & UPDATE Submissions
// ==========================================
clubForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop native page navigation triggers

    const clubId = clubIdInput.value;
    const clubData = {
        name: nameInput.value.trim(),
        president: presidentInput.value.trim(),
        category: categoryInput.value,
        member_count: parseInt(memberCountInput.value) || 0,
        description: descriptionInput.value.trim()
    };

    try {
        let response;
        
        // If clubId contains a value, we know the user is editing an item (UPDATE)
        if (clubId) {
            response = await fetch(`${API_URL}/${clubId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData)
            });
        } else {
            // Otherwise, we know it's a completely new entry (CREATE)
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData)
            });
        }

        if (!response.ok) throw new Error('Server returned an error status during save execution.');

        const result = await response.json();
        alert(result.message);
        
        resetFormState();
        fetchClubRoster(); // Refresh the list without page reloads
    } catch (err) {
        alert(`Action failed: ${err.message}`);
    }
});

// ==========================================
// UTILITY: Prepare Form Fields for UPDATE
// ==========================================
window.prepareUpdate = function(club) {
    clubIdInput.value = club.id;
    nameInput.value = club.name;
    presidentInput.value = club.president;
    categoryInput.value = club.category;
    memberCountInput.value = club.member_count;
    descriptionInput.value = club.description || '';

    // Transform static labels into editable state trackers visually
    formTitle.textContent = '✏️ Modify Campus Club Profile';
    submitBtn.textContent = 'Apply Profile Changes';
    cancelBtn.classList.remove('hidden');
    
    // Smoothly scroll browser window to form coordinates panel block view
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Reset state when cancelling modifications
cancelBtn.addEventListener('click', resetFormState);

function resetFormState() {
    clubForm.reset();
    clubIdInput.value = '';
    formTitle.textContent = '➕ Register a New Campus Club';
    submitBtn.textContent = 'Save Club Profile';
    cancelBtn.classList.add('hidden');
}

// ==========================================
// ACTION: DELETE - Remove Club Profile
// ==========================================
window.deleteClubProfile = async function(id) {
    if (!confirm('Are you absolutely sure you want to remove this club profile from the campus register?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Deletion request rejected by the database pipeline.');

        const result = await response.json();
        alert(result.message);
        fetchClubRoster(); // Instantly refresh our cards panel matrix viewport
    } catch (err) {
        alert(`Deletion failure: ${err.message}`);
    }
};

// Simple utility function to prevent malicious characters (XSS safety)
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}