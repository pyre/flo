#-*- coding: utf-8 -*-


# support
import flo


# declaration
class About(flo.shells.command, family="flo.cli.about"):
    """
    Display human readable information about the app
    """


    # administrative
    @flo.export(tip="the copyright note")
    def copyright(self, plexus, **kwds):
        """
        Print the copyright note of the flo package
        """
        # grab a channel
        channel = plexus.info
        # log the copyright note
        channel.log(flo.meta.copyright)
        # all done
        return


    @flo.export(tip="acknowledgments and sponsor info")
    def credits(self, plexus, **kwds):
        """
        Print the flo package acknowledgments
        """
        # grab a channel
        channel = plexus.info
        # log the copyright note
        channel.log(flo.meta.acknowledgments)
        # all done
        return


    @flo.export(tip="licensing information")
    def license(self, plexus, **kwds):
        """
        Print the flo package license
        """
        # grab a channel
        channel = plexus.info
        # log the copyright note
        channel.log(flo.meta.license)
        # all done
        return


# end of file
