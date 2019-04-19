# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# pull in the command decorators
from .. import foundry, action

# help
@foundry(implements=action, tip="display information about this application")
def about():
    """
    Display information about this application
    """
    from .About import About
    return About


# end of file
