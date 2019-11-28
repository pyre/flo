#-*- coding: utf-8 -*-

# support
import flo


# the flow
class Geo2Rdr(flo.flow.workflow, family="isce3.workflows.geo2rdr"):
    """
    Compute the transformation from geodetic to radar coordinates for a given SLC
    """

    # flow assets
    # the main engine
    geo2rdr = flo.model.factories.geo2rdr()
    geo2rdr.doc = "the SLC converter from radar to geodetic coordinates"

    # sources of input
    slcReader = flo.model.readers.slc()
    slcReader.doc = "the reader of native SLCs"

    topoReader = flo.model.readers.topo()
    topoReader.doc = "the reader of the topo raster"


    # flow hooks
    @flo.export
    def pyre_make(self, **kwds):
        """
        Execute the workflow
        """
        print(f"{self.pyre_spec}")
        # N.B.: this will be automated eventually
        # get the SLC reader to create the SLC
        self.slcReader.pyre_run(**kwds)
        # get the topo reader to create the topo raster
        self.topoReader.pyre_run(**kwds)
        # get geo2rdr to build the transformation
        self.geo2rdr.pyre_run(**kwds)

        # persist
        self.pyre_save()

        # all done
        return


    # meta-methods
    def __init__(self, **kwds):
        # chain up
        super().__init__(**kwds)

        # unpack
        geo2rdr = self.geo2rdr
        topoReader = self.topoReader
        slcReader = self.slcReader

        # bind
        geo2rdr.topo = self.topoReader.topo
        geo2rdr.slc = self.slcReader.slc

        # all done
        return


# end of file
