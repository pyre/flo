# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis
# orthologue
# (c) 1998-2019 all rights reserved
#


# my declaration
class Config:
    """
    Renderer of a component hierarchy as a flat sequence of trait/value pairs
    """


    # trait traversal hooks
    def componentStart(self, component):
        """
        Render a component
        """
        # save the name of the component
        self._context = component
        # and render an empty tuple
        return ()


    def componentEnd(self, component):
        """
        Render a component
        """
        # reset the context
        self._context = None
        # render an empty tuple
        return ()


    def trait(self, name, value):
        """
        Render a trait
        """
        # render
        return f"{self._context.pyre_name}.{name}", f"{value}"


    def value(self, value):
        """
        Renderer a value for a multi-line trait
        """
        # easy
        return value


    # interface obligations that are not part of this implementation
    def indent(self):
        """
        Push context
        """


    def outdent(self):
        """
        Pop context
        """


    # private data
    _context = None


# end of file
