$(document).ready(function () {
  // Set current year
  $(".current-year").text(new Date().getFullYear());

  // Menu loading functionality
  var root = location.protocol + "//" + location.host;

  // Load various menu sections
  const menuSections = [
    "builder-stories",
    "faqs",
    "how-tos",
    "local-permitting",
    "permit-basics",
    "news",
  ];

  menuSections.forEach(function (section) {
    const url = section === "how-tos" ? "/menus/how-tos" : `/menus/${section}`;
    const className = section === "how-tos" ? "how-to-guides" : section;

    $.get(root + url, function (response) {
      var $data = $(response);
      var $data1 = $(response);
      $(
        `.resources-menu-second-block.${className} .resources-menu-second-content`
      ).html($data.filter("#menuload"));
      $(`.resources-menu-item.${className} .mobile-cards`).html(
        $data1.filter("#menuload")
      );
    });
  });

  // Header sticky functionality
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 60) {
      $(".header").addClass("stickyheader");
    } else {
      $(".header").removeClass("stickyheader");
    }
  });

  // Helper function to safely initialize Slick
  function safeSlickInit($element, options) {
    if ($element.length === 0) {
      console.warn(
        "Element not found for Slick initialization:",
        $element.selector
      );
      return false;
    }

    // Check if already initialized
    if ($element.hasClass("slick-initialized")) {
      console.log("Slick already initialized on element:", $element.selector);
      return true;
    }

    try {
      $element.slick(options);
      return true;
    } catch (error) {
      console.error("Error initializing Slick:", error);
      return false;
    }
  }

  // Helper function to safely call Slick methods
  function safeSlickMethod($element, method, ...args) {
    if ($element.length === 0) {
      console.warn("Element not found for Slick method:", $element.selector);
      return false;
    }

    if (!$element.hasClass("slick-initialized")) {
      console.warn("Slick not initialized on element:", $element.selector);
      return false;
    }

    try {
      $element.slick(method, ...args);
      return true;
    } catch (error) {
      console.error("Error calling Slick method:", method, error);
      return false;
    }
  }

  // Logo slider functionality - Fixed
  var logoSliderInitialized = false;
  function logoSlider() {
    var $logos = $(".builders-logos");

    if ($logos.length === 0) return;

    if (window.matchMedia("(min-width: 768px)").matches) {
      // Desktop - InfiniteSlide
      if (!logoSliderInitialized && typeof $.fn.infiniteslide !== "undefined") {
        $logos.infiniteslide({
          speed: 50,
          direction: "left",
          pauseonhover: true,
          responsive: false,
          clone: 2,
        });
        logoSliderInitialized = true;
      }
    } else {
      // Mobile - Slick (initialize only once)
      if (!$logos.hasClass("slick-initialized")) {
        safeSlickInit($logos, {
          infinite: true,
          arrows: false,
          dots: false,
          speed: 600,
          autoplay: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 620,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 567,
              settings: {
                slidesToShow: 2,
              },
            },
          ],
        });
      }
    }
  }

  // Initialize logo slider
  logoSlider();

  // Debounced resize handler
  var resizeTimer;
  $(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      logoSlider();
    }, 250);
  });

  // Projects slider - Fixed
  safeSlickInit($(".projectsslider"), {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          dots: false,
          slidesToShow: 1,
        },
      },
    ],
  });

  // Client slider - Fixed
  safeSlickInit($(".clientslider"), {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Main vertical slider with progress bars - Fixed
  var $mainSlider = $(".slider.singleitem");

  // Check if the slider exists and initialize if not already done
  if ($mainSlider.length > 0 && !$mainSlider.hasClass("slick-initialized")) {
    $mainSlider.slick({
      vertical: true,
      verticalSwiping: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: false,
      infinite: true,
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 500,
      draggable: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            vertical: false,
            verticalSwiping: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            arrows: true,
            fade: false,
            draggable: true,
          },
        },
      ],
    });
  }

  // Progress bar functionality (desktop only)
  if (window.matchMedia("(min-width: 992px)").matches && $mainSlider.length > 0) {
    var percentTime = 0;
    var tick;
    var progressSpeed = 10; // milliseconds between updates
    var totalTime = 3500; // total time for each step in milliseconds
    var progressIncrement = 100 / (totalTime / progressSpeed);
    var progressBarIndex = 0;
    var totalSlides = 6;
    var isPlaying = false;
    var hasStarted = false;

    // Initialize progress bars
    $(".slidertopbox .progressbarslider").each(function (index) {
      $(this).attr('data-slick-index', index);
      if (!$(this).find('.inProgress').length) {
        var progress = "<div class='inProgress inProgress" + index + "'></div>";
        $(this).html(progress);
      }
    });

    function startProgressbar() {
      if (isPlaying) return;
      
      resetProgressbar();
      percentTime = 0;
      isPlaying = true;
      tick = setInterval(interval, progressSpeed);
      
      // Update active step
      updateActiveStep(progressBarIndex);
    }

    function interval() {
      if (!isPlaying) return;
      
      percentTime += progressIncrement;
      
      // Update progress bar width
      $(".inProgress" + progressBarIndex).css({
        width: percentTime + "%",
      });
      
      if (percentTime >= 100) {
        clearInterval(tick);
        isPlaying = false;
        
        // Move to next slide
        setTimeout(function() {
          progressBarIndex = (progressBarIndex + 1) % totalSlides;
          
          // Go to next slide
          if ($mainSlider.hasClass("slick-initialized")) {
            safeSlickMethod($mainSlider, "slickGoTo", progressBarIndex, false);
          }
          
          // Start next progress bar
          startProgressbar();
        }, 200);
      }
    }

    function resetProgressbar() {
      $(".inProgress").css({
        width: "0%",
      });
      clearInterval(tick);
      isPlaying = false;
    }

    function updateActiveStep(index) {
      $(".slidertopitem").removeClass("activestep");
      $(".slidertopitem").eq(index).addClass("activestep");
    }

    function goToStep(index) {
      clearInterval(tick);
      isPlaying = false;
      
      // Reset all progress bars
      resetProgressbar();
      
      // Set new index
      progressBarIndex = index;
      
      // Update active step
      updateActiveStep(progressBarIndex);
      
      // Go to slide
      if ($mainSlider.hasClass("slick-initialized")) {
        safeSlickMethod($mainSlider, "slickGoTo", progressBarIndex, false);
      }
      
      // Start progress bar for this step
      setTimeout(function() {
        startProgressbar();
      }, 100);
    }

    // Click handlers for step navigation
    $(".slidertopitem").off('click.progressbar').on('click.progressbar', function (e) {
      e.preventDefault();
      var goToIndex = $(this).index();
      if (goToIndex >= 0 && goToIndex < totalSlides) {
        goToStep(goToIndex);
      }
    });

    // Hover pause functionality
    var $hoverTarget = $(".howitworks-section, .slidermain");
    $hoverTarget.off('mouseenter.progressbar mouseleave.progressbar')
      .on('mouseenter.progressbar', function() {
        if (isPlaying) {
          clearInterval(tick);
          isPlaying = false;
        }
      })
      .on('mouseleave.progressbar', function() {
        if (hasStarted && !isPlaying) {
          isPlaying = true;
          tick = setInterval(interval, progressSpeed);
        }
      });

    // Start when section comes into view
    var scrollHandlerStarted = false;
    $(window).off('scroll.progressbar').on('scroll.progressbar', function () {
      var $target = $("#Howitworks, .howitworks-section");
      if ($target.length === 0) return;

      var offset = $target.offset().top;
      var windowTop = $(window).scrollTop();
      var windowHeight = $(window).height();
      
      // Start when section is 50% visible
      if (windowTop + windowHeight * 0.5 >= offset && !scrollHandlerStarted) {
        scrollHandlerStarted = true;
        hasStarted = true;
        
        // Initialize first step
        progressBarIndex = 0;
        updateActiveStep(0);
        
        // Start the animation
        setTimeout(function() {
          startProgressbar();
        }, 500);
      }
    });

    // Handle window visibility change
    $(document).off('visibilitychange.progressbar').on('visibilitychange.progressbar', function() {
      if (document.hidden) {
        if (isPlaying) {
          clearInterval(tick);
          isPlaying = false;
        }
      } else if (hasStarted && !isPlaying) {
        isPlaying = true;
        tick = setInterval(interval, progressSpeed);
      }
    });

    // Keyboard navigation
    $(document).off('keydown.progressbar').on('keydown.progressbar', function(e) {
      if (!hasStarted) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var nextStep = (progressBarIndex + 1) % totalSlides;
        goToStep(nextStep);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prevStep = (progressBarIndex - 1 + totalSlides) % totalSlides;
        goToStep(prevStep);
      }
    });

    // Handle responsive breakpoint changes
    $(window).off('resize.progressbar').on('resize.progressbar', function() {
      var resizeTimer;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.matchMedia("(max-width: 991px)").matches) {
          // Mobile view - stop progress bars
          clearInterval(tick);
          isPlaying = false;
          hasStarted = false;
          scrollHandlerStarted = false;
          resetProgressbar();
        } else if (!hasStarted) {
          // Desktop view - check if we should start
          $(window).trigger('scroll.progressbar');
        }
      }, 250);
    });
  }

  // Permit slider functionality (desktop only) - Fixed
  if (window.matchMedia("(min-width: 992px)").matches) {
    var $permitSlider = $(".singlepermitslider");

    if (
      safeSlickInit($permitSlider, {
        vertical: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        infinite: true,
        arrows: false,
        dots: false,
        autoplay: false,
        speed: 1000,
        draggable: false,
      })
    ) {
      var percentTimeOne = 0;
      var tickOne;
      var timeBar = 1;
      var progressBarIndexOne = 0;

      $(".sliderpermitbox .progressbar").each(function (index) {
        var progressOne =
          "<div class='inProgressbox inProgressbox" + index + "'></div>";
        $(this).html(progressOne);
      });

      function startProgressbarOne() {
        resetProgressbarOne();
        percentTimeOne = 0;
        tickOne = setInterval(intervalBar, 10);
      }

      function intervalBar() {
        if (
          $(
            '.singlepermitslider .slick-track div[data-slick-index="' +
              progressBarIndexOne +
              '"]'
          ).attr("aria-hidden") === "true"
        ) {
          progressBarIndexOne = $(
            '.singlepermitslider .slick-track div[aria-hidden="false"]'
          ).data("slickIndex");
          startProgressbarOne();
        } else {
          percentTimeOne += 1 / (timeBar + 5);
          $(".inProgressbox").parent().parent().removeClass("activestep");
          $(".inProgressbox" + progressBarIndexOne)
            .parent()
            .parent()
            .addClass("activestep");
          $(".inProgressbox" + progressBarIndexOne).css({
            width: percentTimeOne + "%",
          });
          if (percentTimeOne >= 100) {
            // Fixed: Use correct selector
            safeSlickMethod($permitSlider, "slickNext");
            progressBarIndexOne++;
            if (progressBarIndexOne > 3) {
              progressBarIndexOne = 0;
            }
            startProgressbarOne();
          }
        }
      }

      function resetProgressbarOne() {
        $(".inProgressbox").css({
          width: 0 + "%",
        });
        clearInterval(tickOne);
      }

      $(".sliderpermittopitem").click(function () {
        clearInterval(tickOne);
        var goToThisIndex = $(this).find(".progressbar").data("slickIndex");
        // Fixed: Use correct selector
        safeSlickMethod($permitSlider, "slickGoTo", goToThisIndex, false);
        startProgressbarOne();
      });

      var permitScrollHandlerStarted = false;
      $(window).scroll(function () {
        var $target = $("#Permitflow");
        if ($target.length === 0) return;

        var offsetOne = $target.offset().top;
        if ($(window).scrollTop() >= offsetOne) {
          if (percentTimeOne === 0 && !permitScrollHandlerStarted) {
            permitScrollHandlerStarted = true;
            startProgressbarOne();
          }
        }
      });
    }
  }

  // Industry logo slider (mobile only) - Fixed
  if (window.matchMedia("(max-width: 767px)").matches) {
    safeSlickInit($(".industrylogobox"), {
      fade: false,
      infinite: false,
      arrows: false,
      dots: false,
      autoplay: true,
      speed: 600,
      draggable: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 567,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  // Company logos slider - Fixed
  safeSlickInit($(".company-logos-slider"), {
    infinite: true,
    arrows: false,
    dots: false,
    autoplay: true,
    speed: 600,
    draggable: true,
    centerMode: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  });

  // Case studies slider - Fixed
  safeSlickInit($(".case-studies-slider"), {
    infinite: true,
    arrows: true,
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 478,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Wait for dynamic content to load before initializing certain sliders
  setTimeout(function () {
    // Re-check and initialize any sliders that might have been added dynamically
    $(".projectsslider:not(.slick-initialized)").each(function () {
      safeSlickInit($(this), {
        dots: false,
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 768,
            settings: {
              dots: false,
              slidesToShow: 1,
            },
          },
        ],
      });
    });
  }, 2000);
});

