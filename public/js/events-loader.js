// /js/events-loader.js
class EventsLoader {
    constructor() {
        this.eventsData = null;
        this.allEvents = [];
    }

    async loadEvents() {
        try {
            const response = await fetch('/data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.eventsData = await response.json();
            
            // Flatten events for upcoming events functionality
            this.allEvents = [];
            this.eventsData.semesters.forEach(semester => {
                semester.events.forEach(event => {
                    this.allEvents.push({
                        ...event,
                        semester: semester.title
                    });
                });
            });
            
            console.log(`✅ Loaded ${this.allEvents.length} events from JSON`);
            return this.eventsData;
        } catch (error) {
            console.error('❌ Error loading events:', error);
            return null;
        }
    }

    getUpcomingImportantEvents(limit = 5) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter events with:
        // 1. remark: "important"
        // 2. valid parsed date (not "To be announced")
        // 3. date is today or in future
        const upcomingEvents = this.allEvents
            .filter(event => {
                // Check if event is marked as important
                if (event.remark !== "important") return false;
                
                // Skip if no valid date
                if (event.date_parsed === "2026-12-31" || !event.date_parsed) return false;
                
                const eventDate = new Date(event.date_parsed);
                return eventDate >= today;
            })
            .sort((a, b) => new Date(a.date_parsed) - new Date(b.date_parsed))
            .slice(0, limit);
        
        console.log(`📅 Found ${upcomingEvents.length} upcoming IMPORTANT events`);
        return upcomingEvents;
    }

    renderEventsPage() {
        const calendarContainer = document.getElementById('calendarContainer');
        if (!calendarContainer) {
            console.error('Calendar container not found');
            return;
        }
        
        if (!this.eventsData) {
            calendarContainer.innerHTML = '<div class="error-message">Failed to load events data</div>';
            return;
        }
        
        // Clear loading indicator
        calendarContainer.innerHTML = '';
        
        // Update semester heading
        const semesterHeading = document.getElementById('semester-heading');
        if (semesterHeading) {
            semesterHeading.textContent = 'Even Semester (Jan - June)';
        }
        
        // Render each semester
        this.eventsData.semesters.forEach((semester, index) => {
            const semesterSection = document.createElement('div');
            semesterSection.className = 'semester-section';
            
            // Add semester title
            const title = document.createElement('h3');
            title.className = 'semester-title';
            title.textContent = semester.title;
            semesterSection.appendChild(title);
            
            // Add events
            semester.events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'calendar-event';
                
                // Add 'important' class if remark is important
                if (event.remark === 'important') {
                    eventElement.classList.add('important-event');
                }
                
                eventElement.innerHTML = `
                    <div class="event-serial">${event.serial}.</div>
                    <div class="event-description">
                        ${event.description}
                    </div>
                    <div class="event-date">${event.date_range}</div>
                `;
                semesterSection.appendChild(eventElement);
            });
            
            // Add note box for odd semester
            if (semester.note) {
                const noteBox = document.createElement('div');
                noteBox.className = 'note-box';
                noteBox.innerHTML = `<strong>Note:</strong> ${semester.note}`;
                semesterSection.appendChild(noteBox);
            }
            
            calendarContainer.appendChild(semesterSection);
        });
        
        console.log('✅ Events page rendered successfully');
    }

    renderUpcomingImportantEvents(limit = 5) {
        const container = document.getElementById('eventList');
        if (!container) {
            console.error('Event list container not found');
            return;
        }
        
        const upcomingEvents = this.getUpcomingImportantEvents(limit);
        
        // Clear loading indicator or existing content
        container.innerHTML = '';
        
        if (upcomingEvents.length === 0) {
            container.innerHTML = '<p class="no-events">🎉 No important upcoming events scheduled</p>';
            return;
        }
        
        upcomingEvents.forEach(event => {
            const div = document.createElement('div');
            div.className = 'event-card important-event-card';
            div.innerHTML = `
                <div class="event-title">
                    ${event.description}
                </div>
                <div class="event-date">${event.date_range}</div>
            `;
            container.appendChild(div);
        });
        
        console.log(`✅ Displayed ${upcomingEvents.length} upcoming IMPORTANT events on dashboard`);
    }
}