// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {

// A function that shows the current date & time at the top of the page
// This uses moment() to get the date & time
    $(document).ready(function() {
        var rightNow = function () {
            var date = moment();
        $("#rightNow").text(date.format('dddd, MMMM Do, YYYY, h:mm a'));
        };

// A function that makes it so above function is running 
// And updates as time passes. No need to refresh the page to know the time!
        $(document).ready(function() { 
            rightNow();
            setInterval(rightNow, 1000);
        });
    
// A variable to represent the current hour using moment()
        var currentHour = moment().format('H');

// Using the above, it determines what class to add to each time block
// If the current hour is equal to the time block id (which is also the hour), then present class is added
// If the current hour is higher than the time block id, then past class is added
// Anything else will be assigned the future class
        $(".time-block").each(function() {
            if (parseInt(currentHour) === parseInt(this.id)) {
                $(this).addClass("present");
            } else if (parseInt(currentHour) > parseInt(this.id)) {
                $(this).addClass("past");
            } else {
                $(this).addClass("future");
            }
        })

// This performs the same as the above so the background of the save button
// will also take the same colour. 
        $(".saveBtn").each(function() {
            if (parseInt(currentHour) === parseInt(this.id.split("-")[1])) {
                $(this).addClass("present");
            } else if (parseInt(currentHour) > parseInt(this.id.split("-")[1])) {
                $(this).addClass("past");
            } else {
                $(this).addClass("future");
            }
        })

// An empty array to push events to
// This will be what gets locally saved later
        var schedule = [];

// Calling initialize function to run before rendering the events
        initialize();

// A function that renders each events inputted in each textarea
// Then, will take the value of each individual textarea (determined by its time)
// And make it equal to that the schedule's event text
        function renderEvents() {
            $("textarea").each(function() {
                this.value = "";
            })
            
            $.each(schedule, function() {
                $("textarea." + this.eventTime)[0].value = this.eventText;
            }) 
        }    

// A function that parses the JavaScript object of schedule, 
// getting the schedule to be saved to local storage
// If it is not null (meaning if it is a JavaScript object),
// then the schedule is parsed
// Afterwards, it calls renderEvents function to run
// It was called above!
        function initialize() {
            var userEvent = JSON.parse(localStorage.getItem("schedule"));
            if (userEvent !== null) {
                schedule = userEvent;
            }
    
            renderEvents();
        }
    
// A function that stores the schedule as a JSON string
        function storeEvents() {
            localStorage.setItem("schedule", JSON.stringify(schedule));
        }
        
// An event listening function that if the button is clicked, will run
// First, it is important to prevent default & stop propagation when clicking
        $("button").click(function(event) {
        event.preventDefault();
        event.stopPropagation();

// className takes the targetted button's class
        var className = $(event.target).attr("class");
        
// eventObject contains both eventTime & eventText
// eventTime is equal to the targetted button's class (which is same as their 24h time)
// eventText is equal to the individual textarea's value (which will be what we wrote within it)
        var eventObject = {
            eventTime: className,
            eventText: $("textarea." + className).val()
        } 

// If the schedule length is greater than zero (when we save more than once),
// it will perform a function so if schedule's eventTime is completely equal to the targetted button's class name,
// it will splice both so that the current content overwrites the old content
        if (schedule.length > 0) {
            $.each(schedule, function() {
                if (this.eventTime === event.target.className) {
                    schedule.splice($.inArray(this, schedule), 1);
                }    
            })};

// For each individual schedule item, 
// if the event text is empty, then it will remove said time from showing
        $.each(schedule, function() {
            if (this.eventText === "") {
            schedule.splice($.inArray(this, schedule), 1);
            }
        });

// Pushes eventObject array into the empty schedule array
        schedule.push(eventObject);

// Logging eventObject to console just to see that it works
        console.log(eventObject)

// Runs the function storeEvents & renderEvents the scheduler can work!
        storeEvents();
        renderEvents (); 
        
        });
    });
})


    // TODO: Add a listener for click events on the save button. This code should
    // use the id in the containing time-block as a key to save the user input in
    // local storage. HINT: What does `this` reference in the click listener
    // function? How can DOM traversal be used to get the "hour-x" id of the
    // time-block containing the button that was clicked? How might the id be
    // useful when saving the description in local storage?
    //
    // TODO: Add code to apply the past, present, or future class to each time
    // block by comparing the id to the current hour. HINTS: How can the id
    // attribute of each time-block be used to conditionally add or remove the
    // past, present, and future classes? How can Day.js be used to get the
    // current hour in 24-hour time?
    //
    // TODO: Add code to get any user input that was saved in localStorage and set
    // the values of the corresponding textarea elements. HINT: How can the id
    // attribute of each time-block be used to do this?
    //
    // TODO: Add code to display the current date in the header of the page.
