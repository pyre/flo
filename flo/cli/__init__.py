# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# get the package
import flo


# the workspace manager
@flo.foundry(implements=flo.shells.action, tip="access the workspace manager")
def ws():
    """
    Access the workspace manager
    """
    # get the panel
    from .Workspaces import Workspaces
    # publish it
    return Workspaces


# help
@flo.foundry(implements=flo.shells.action, tip="display information about this application")
def about():
    """
    Display information about this application
    """
    # get the panel
    from .About import About
    # publish it
    return About


# end of file
