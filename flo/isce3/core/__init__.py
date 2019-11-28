#-*- coding: utf-8 -*-


# get the package
import flo


# foundries for core components; they help resolve user friendly words into component instances
@flo.foundry(implements=flo.model.core.ellipsoid,
               tip="the reference implementation of an ellipsoidal gravitational model")
def ellipsoid():
    # pull the implementation
    from .Ellipsoid import Ellipsoid
    # steal its docstring
    __doc__ = Ellipsoid.__doc__
    # and publish it
    return Ellipsoid


# end of file
