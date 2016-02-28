/*!
 * jQuery Accordion Live Filter
 * @author Aaron Saray
 */
;(function($) {
    "use strict";

    /**
     * Accordion Live Filter Class
     *
     * @param element The filter field
     * @param options {*} Options object
     * @constructor
     */
    var AccordionLiveFilter = function(element, options) {

        this.settings = $.extend({
            dataAccordionReference: 'alf',
            clearFilterClass: 'alf-filter-clear',
            matchedClass: 'alf-matched',
            expandedClass: 'alf-expanded'
        }, options);

        this.$filterElement = $(element);
        this.$accordion = this.getAccordion();

        this.addAccordionRelationshipsAndHandlers();
        this.addFilterHandler();
        this.addFilterClear();
    };

    /**
     * Gets the associated accordion to the filter field
     *
     * This will throw an error if its not found
     * @returns {*|HTMLElement}
     */
    AccordionLiveFilter.prototype.getAccordion = function() {
        var selector = this.$filterElement.data(this.settings.dataAccordionReference);
        if (!selector) {
            throw new Error('The accordion search filter element needs a data-' + this.settings.dataAccordionReference + ' element with a jquery selector.');
        }

        var $accordion = $(selector);
        if ($accordion.length == 0) {
            throw new Error('The selector ' + selector + ' was not found.');
        }
        return $accordion;
    };

    /**
     * Add the delete button to the item
     */
    AccordionLiveFilter.prototype.addFilterClear = function() {
        var $delete = $('<a href="#">&times;</a>').addClass(this.settings.clearFilterClass);
        $delete.on('click', function(e) {
            e.preventDefault();
            this.$filterElement.val('');
            $('label', this.$accordion).trigger('contract.alf');
            $('li', this.$accordion).removeClass('potential');
        }.bind(this));
        this.$filterElement.after($delete);
    };

    /**
     * Add handler for the accordion and the relationship between the filter and the accordion
     */
    AccordionLiveFilter.prototype.addAccordionRelationshipsAndHandlers = function() {
        var self = this;

        $('label', this.$accordion).each(function(i, label) {
            var $label = $(label);
            var $ul = $label.next('ul');

            /** here, add the handlers for the label **/
            $label.on('expand.alf', function() {
                $(this).addClass(self.settings.expandedClass);
                $ul.slideDown();
            }).on('contract.alf', function() {
                $(this).removeClass(self.settings.expandedClass);
                $ul.slideUp();
            }).on('click', function() {
                var $label = $(this);
                $label.hasClass(self.settings.expandedClass) ? $label.trigger('contract.alf') : $label.trigger('expand.alf');
            });

            /** now, cache the relationships so we don't always have to traverse **/
            $label.data('alf-child', $ul);
            $ul.data('alf-parent', $label);
        });
    };

    /**
     * Add the filter handler
     */
    AccordionLiveFilter.prototype.addFilterHandler = function() {
        var self = this;

        this.$filterElement.on('keyup change', function() {

            var query = this.value.toLowerCase();

            $('li > ul', self.$accordion).each(function(i, ul) {
                var $ul = $(ul),
                    $ulParent = $ul.data('alf-parent'),
                    $ulChildren = $ul.children(),
                    trigger = 'contract.alf';

                $ulChildren.removeClass(self.settings.matchedClass);
                if (query) {
                    if ($ul.text().toLowerCase().indexOf(query) >= 0) {
                        $ulChildren.each(function(i, li) {
                            var $li = $(li);
                            if ($li.text().toLowerCase().indexOf(query) >= 0) {
                                $li.addClass(self.settings.matchedClass);
                            }
                        });
                        trigger = 'expand.alf';
                    }
                }
                $ulParent.trigger(trigger);
            });
        });

    };

    /**
     * Plugin Proxy for jQuery
     * @param options
     * @returns {*}
     * @constructor
     */
    function Plugin(options) {
        return this.each(function() {
            new AccordionLiveFilter(this, options);
        });
    }

    $.fn.accordionLiveFilter = Plugin;
}(jQuery));

