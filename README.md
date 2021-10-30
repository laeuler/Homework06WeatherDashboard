# Homework06WeatherDashboard

This is the repository to hand in the homework from week 6

# Acknowledgements

- This week homework submission builds on the work from Suraj Verma
- [Copied Repo](https://github.com/surajverma2587/weather-dashboard/tree/dev)

Thanks a lot for the initial work that helps us to focus on the Project 1 Phase.

# Links to the files

- [GitHub Repository](https://github.com/laeuler/Homework06WeatherDashboard)
- [GitHub Page](https://laeuler.github.io/Homework06WeatherDashboard)

# Adjustments made & Mockup

There've been several adjustments made in comparison to the original code

- The UI differentiates stronger between navigation, usable components and forecast by darker color
- a clear recent cities option was added to improve usability
- when the user hovers over the recent cities, visual feedback implies that you can click on it (color change)
- when you search for a city (click on search button), the search field is cleared
- Cities with two words ran intro problems when accessing them through the recent cities list (cityName = target.data("City") before). That was adjusted (cityName = target.text())
- forecast is now displayed in metric units (previously imperial)
- the current forecast card at the top was subjected to several changes
  - Time and date are now reffering to the time of the city, not the local time of the user
  - UV index color coding is now using a class not associated with button behavior
  - felt temperature was added
  - depending on the local time of the city it determined wether it is daytime or night time and the background of the card is adjusted accordingly + either next Sunrise or Sunset time is displayed as well
  - local times are calculated through the timezone offset from the API plus 2h (Berlin time), did not find an option so far to make the 2h dependent on the location of the user. 1h offset for London time is expected therefore
- forecast cards for the next 5 days are aligned to the left
- JavaScript code is now commented

![General UI](./assets/screencapture/GeneralUI.png)

# Closing Remarks

The provided code we could build on helps a lot to understand the logic flow and thinking used when using APIs, asynchronous JavaScript components.

Thank you very much for that.

Looking forward to the feedback

Lars
