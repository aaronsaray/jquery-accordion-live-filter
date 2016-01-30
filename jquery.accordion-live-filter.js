/**
 * jQuery Accordion Live Filter
 * @author Aaron Saray
 */
;(function($) {

    /**
     * Accordion Filter plugin
     * @returns {*}
     */
    $.fn.accordionLiveFilter = function() {

        /**
         * Adds the handler to the accordion element
         * @param $element
         */
        function addAccordionHandler($element)
        {
            $('label', $element).on('click', function() {
                if ($(this).hasClass('expanded')) {
                    hideCategory($(this).next());
                }
                else {
                    showCategory($(this).next());
                }
            });
        }

        function addFilterHandler($filterField, $accordion)
        {
            $filterField.on('keyup', function() {
                var query = $filterField.val().toLowerCase();
                $('li > ul', $accordion).each(function(index, element) {
                    var $ul = $(element);
                    var $ulChildren = $ul.children();
                    $ulChildren.removeClass('potential');

                    if (query) {
                        var ulText = $ul.text();
                        var idx = ulText.toLowerCase().indexOf(query);
                        if (idx >= 0) {
                            $ulChildren.each(function(i, e) {
                                var $e = $(e);
                                if ($e.text().toLowerCase().indexOf(query) >= 0) {
                                    $e.addClass('potential');
                                }
                            });
                            showCategory($ul);
                            return true;
                        }
                    }
                    hideCategory($ul);
                });
            });
        }

        function showCategory($ul)
        {
            $ul.slideDown().prev().addClass('expanded');
        }

        function hideCategory($ul)
        {
            $ul.slideUp().prev().removeClass('expanded');
        }

        return this.each(function() {
            var $filterField = $(this);

            var selector = $filterField.data('alf');
            if (!selector) {
                throw new Error('The accordion search filter element needs a data-alf element with a jquery selector.');
            }

            var $accordion = $(selector);
            if ($accordion.length == 0) {
                throw new Error('The selector ' + selector + ' was not found.');
            }

            addAccordionHandler($accordion);
            addFilterHandler($filterField, $accordion);
        });
    };
}(jQuery));

