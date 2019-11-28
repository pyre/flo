#-*- coding: utf-8 -*-


# support
import flo


# the product
class DEM(flo.flow.product,
          family="isce3.products.dem", implements=flo.model.products.dem):
    """
    A digital elevation model
    """


    # product meta-data
    region = flo.properties.array()
    region.doc = "the geographic region of the elevation model"

    width = flo.properties.int()
    width.doc = "the number of pixels across"

    length = flo.properties.int()
    length.doc = "the number of pixels down"


    # public data
    raster = None


# end of file
