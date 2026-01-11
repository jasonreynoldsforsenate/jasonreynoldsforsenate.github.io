document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('campaign-calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: '' // clean look
        },
        themeSystem: 'bootstrap5',
        events: [
            {
                title: 'r/Virginia AMA',
                start: '2025-12-14',
                extendedProps: {
                    type: 'virtual',
                    time: '9am - whenever',
                    location: 'r/Virginia'
                },
                url: 'https://www.reddit.com/r/Virginia'
            },
            {
                title: 'Petition Signature Collection Starts',
                start: '2026-01-01',
                color: '#35dc5cff', // Green for kickoff
                extendedProps: {
                    type: 'kickoff', // Assuming mostly physical
                    time: 'All Day',
                    location: 'Virginia'
                }
            },
            {
                title: 'Neighbors For Change Ballot Petition',
                start: '2026-01-06T18:00:00',
                end: '2026-01-06T20:00:00',
                extendedProps: {
                    type: 'in-person',
                    time: '6pm - 8pm',
                    location: 'Twin Hickory Library, Glen Allen'
                }
            },
            {
                title: 'Our Vote Counts Town Hall',
                start: '2026-01-14T19:00:00',
                extendedProps: {
                    type: 'virtual', 
                    time: '7pm',
                    location: 'TBD',
                    url: ''
                },
                // Added a placeholder URL or ensure logic handles missing URL gracefully
                // If it's a virtual event with a link coming soon, we might not have a URL yet.
            },
            {
                title: 'Madison County Dem Meeting',
                start: '2026-02-28T09:30:00',
                end: '2026-02-28T11:00:00',
                extendedProps: {
                    type: 'in-person',
                    time: '9:30am - 11am',
                    location: 'Antioch Baptist Church, 1165 Mud Rd, Madison, VA 22727'
                }
            },            {
                title: 'Roanoke County Democrats Meeting',
                start: '2026-02-05T19:00:00',
                end: '2026-02-05T21:00:00',
                extendedProps: {
                    type: 'in-person',
                    time: '7pm - 9pm',
                    location: 'Roanoke Council Garden Clubs, 3640 Colonial Ave, Roanoke, VA 24018'
                }
            },
            {
                title: 'Deadline to Register to Vote in the Primary',
                start: '2026-06-05', // Approx
                color: '#dc3545', // Red for deadlines
                extendedProps: {
                    type: 'deadline',
                    time: '',
                    location: ''
                }
            },
            {
                title: 'Early Voting Period Opens',
                start: '2026-05-01', // Approx
                color: '#35dc5cff', // Green for kickoff
                extendedProps: {
                    type: 'kickoff',
                    time: '',
                    location: ''
                }
            },            {
                title: 'Early Voting Period Closes',
                start: '2026-06-13', // Approx
                color: '#dc3545', // Red for deadlines
                extendedProps: {
                    type: 'deadline',
                    time: '',
                    location: ''
                }
            },
            {
                title: 'In-Person Primary Voting',
                start: '2026-06-16',
                color: '#dc3545',
                extendedProps: {
                    type: 'in-person',
                    time: 'All Day',
                    location: 'Polls'
                }
            }
        ],
        eventDidMount: function(info) {
            // Tooltip: Title + Time + Location
            var tooltipContent = '<strong>' + info.event.title + '</strong>';
            if (info.event.extendedProps.time) {
                tooltipContent += '<br>' + info.event.extendedProps.time;
            }
            if (info.event.extendedProps.location) {
                tooltipContent += '<br>' + info.event.extendedProps.location;
            }
            
            // Add "Click to Open" for virtual events if URL exists
            var url = info.event.url || (info.event.extendedProps && info.event.extendedProps.url);
            if (info.event.extendedProps.type === 'virtual' && url) {
                 tooltipContent += '<br><em>Click to Open</em>';
            } else if (info.event.extendedProps.type === 'in-person' && info.event.extendedProps.location) {
                 tooltipContent += '<br><em>Click for Map</em>';
            }
            
            var isMobile = 'ontouchstart' in document.documentElement || window.innerWidth < 768;

            if (isMobile) {
                // Mobile: Long press for details, Tap to click (handled by eventClick)
                var tooltip = new bootstrap.Tooltip(info.el, {
                    title: tooltipContent,
                    html: true,
                    placement: 'top',
                    trigger: 'manual', 
                    container: 'body'
                });

                var pressTimer;

                info.el.addEventListener('touchstart', function(e) {
                    pressTimer = setTimeout(function() {
                        tooltip.show();
                        // Optional: Vibration feedback could be added here
                    }, 500); // 500ms for long press
                }, { passive: true });

                info.el.addEventListener('touchend', function(e) {
                    clearTimeout(pressTimer);
                    // Hide after delay to allow reading
                    setTimeout(function() {
                        tooltip.hide(); 
                    }, 6000); 
                });

                info.el.addEventListener('touchmove', function(e) {
                    clearTimeout(pressTimer); // Cancel on scroll
                });
            } else {
                // Desktop: Standard Hover
                new bootstrap.Tooltip(info.el, {
                    title: tooltipContent,
                    html: true,
                    placement: 'top',
                    trigger: 'hover',
                    container: 'body'
                });
            }
        },
        eventContent: function(arg) {
            // Icons only
            var icon = '';
            if (arg.event.extendedProps.type === 'virtual') {
                icon = '<i class="fas fa-laptop" style="font-size: 1.2em;"></i>';
            } else if (arg.event.extendedProps.type === 'in-person') {
                icon = '<i class="fas fa-user" style="font-size: 1.2em;"></i>'; 
            } else if (arg.event.extendedProps.type === 'kickoff') {
                icon = '<i class="fas fa-traffic-light" style="font-size: 1.2em; color: #35dc5cff;"></i>';
            } else if (arg.event.extendedProps.type === 'deadline') {
                icon = '<i class="fas fa-traffic-light" style="font-size: 1.2em; color: #dc3545;"></i>';
            } else {
                 // For others, maybe a dot or small generic icon?
                 // Or just return minimal text if no icon. But user requested 'remove text'.
                 // Let's use a circle for generic.
                 icon = '<i class="fas fa-circle" style="font-size: 0.8em;"></i>';
            }
            
            return { html: '<div class="text-center w-100">' + icon + '</div>' };
        },
        eventClick: function(info) {
            var url = info.event.url || (info.event.extendedProps && info.event.extendedProps.url);
            
            if (url) {
                info.jsEvent.preventDefault();
                window.open(url, '_blank');
            } else if (info.event.extendedProps.type === 'in-person' && info.event.extendedProps.location) {
                info.jsEvent.preventDefault();
                var mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(info.event.extendedProps.location);
                window.open(mapUrl, '_blank');
            }
        }
    });

    calendar.render();
});
