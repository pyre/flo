#-*- coding: utf-8 -*-


# get the package
import flo


# command foundries
# info about the app
@flo.foundry(implements=flo.shells.action, tip="display information about this app")
def about():
    """
    Display human readable information about the app
    """
    # load the command
    from .About import About
    # and publish it
    return About


# information about the layout of the flo package
@flo.foundry(implements=flo.shells.action, tip="information about the layout of {flo}")
def config():
    """
    Display configuration information about the {flo} package
    """
    # load the command
    from .Config import Config
    # and publish it
    return Config


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


# easy access to specific workflows
@flo.foundry(implements=flo.shells.action,
               tip="compute a transformation from geodetic to radar coordinates for a given SLC")
def geo2rdr():
    """
    Invoke the {geo2rd} workflow to compute the transformation from geodetic coordinates to
    radar coordinates for a given SLC
    """
    # load the command
    from .Geo2Rdr import Geo2Rdr
    # and publish it
    return Geo2Rdr


@flo.foundry(implements=flo.shells.action,
               tip="compute a transformation from radar to geodetic coordinates for a given SLC")
def rdr2geo():
    """
    Invoke the {rdr2geo} workflow to compute the transformation from radar coordinates to
    geodetic coordinates for a given SLC
    """
    # load the command
    from .Rdr2Geo import Rdr2Geo
    # and publish it
    return Rdr2Geo


@flo.foundry(implements=flo.shells.action,
               tip="resample an SLC")
def resamp():
    """
    Invoke the {resamp} workflow
    """
    # load the command
    from .Resamp import Resamp
    # and publish it
    return Resamp


# support
@flo.foundry(implements=flo.shells.action)
def complete():
    """
    Support for auto-completion
    """
    # load the command
    from .Complete import Complete
    # and publish it
    return Complete


# end of file
