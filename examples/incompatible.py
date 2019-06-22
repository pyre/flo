#!/usr/bin/env python3
# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# get the package
import flo

# my app
class Incompatible(flo.application, family="flo.applications.incompatible"):
    """
    Create a binding that should be rejected due to type incompatibilities
    """

    # user configurable state
    flow = flo.flow.flow()
    flow.doc = "my flow node container"


    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # make a channel
        channel = self.info

        # make a new SLC factory
        f = flo.isce.newFormSLC()
        # save the current value of its {raw} product
        raw = f.raw
        # show me
        channel.log(f"good value: {f.raw}")

        # attempt to
        try:
            # make a bad binding using an explicit instance
            f.raw = flo.isce.newSLC()
            # should not be reachable
            assert False
        # if it got detected correctly
        except self.ProtocolCompatibilityError as error:
            # verify the value is unchanged
            assert f.raw is raw

        # attempt to
        try:
            # make a bad binding using the foundry
            f.raw = flo.isce.slc
            # should not be reachable
            assert False
        # if it got detected correctly
        except self.ProtocolCompatibilityError as error:
            # verify the value is unchanged
            assert f.raw is raw

        # attempt to
        try:
            # make a bad binding using the uri to the SLC
            f.raw = "import:flo.isce.slc"
            # should not be reachable
            assert False
        # if it got detected correctly
        except self.ResolutionError as error:
            # verify the value is unchanged
            assert f.raw is raw

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Incompatible(name="incompatible")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file
