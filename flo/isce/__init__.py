# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# support
import flo


# products
@flo.foundry(implements=flo.model.raw, tip="the ISCE RAW data product")
def raw():
    # get the implementation
    from .RAW import RAW
    # borrow its docstring
    __doc__ = RAW.__doc__
    # and publish it
    return RAW


@flo.foundry(implements=flo.model.slc, tip="the ISCE SLC data product")
def slc():
    # get the implementation
    from .SLC import SLC
    # borrow its docstring
    __doc__ = SLC.__doc__
    # and publish it
    return SLC


# factories
@flo.foundry(implements=flo.model.formSLC, tip="the ISCE SLC factory")
def formSLC():
    # get the implementation
    from .FormSLC import FormSLC
    # borrow its docstring
    __doc__ = FormSLC.__doc__
    # and publish it
    return FormSLC


# functions that create instances
def newRAW(**kwds):
    """
    Build a new instance of a RAW product
    """
    # get the class
    from .RAW import RAW
    # build one and return it
    return RAW(**kwds)


def newSLC(**kwds):
    """
    Build a new instance of a SLC product
    """
    # get the class
    from .SLC import SLC
    # build one and return it
    return SLC(**kwds)


def newFormSLC(**kwds):
    """
    Build a new instance of a FormSLC factory
    """
    # get the class
    from .FormSLC import FormSLC
    # build one and return it
    return FormSLC(**kwds)


# end of file
