package com.fos;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.github.yamill.orientation.OrientationPackage;
import io.sentry.RNSentryPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import org.reactnative.camera.RNCameraPackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new OrientationPackage(),
            new RNSentryPackage(),
            new ImageResizerPackage(),
            new FastImageViewPackage(),
            new SplashScreenReactPackage(),
            new BackgroundTimerPackage(),
            new RNFusedLocationPackage(),
            new RNAndroidLocationEnablerPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage(),
            new RNCameraPackage(),
            new SmsListenerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
