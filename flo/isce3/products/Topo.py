#-*- coding: utf-8 -*-


# support
import flo


# the product
class Topo(flo.flow.product,
          family="isce3.products.topo", implements=flo.model.products.topo):
    """
    A topo raster
    """


    # product meta-data
    width = flo.properties.int()
    width.doc = "the number of pixels across"

    length = flo.properties.int()
    length.doc = "the number of pixels down"


    # public data
    raster = None


# end of file
