/*
 *  Copyright 2015-2016 Eurocommercial Properties NV
 *
 *  Licensed under the Apache License, Version 2.0 (the
 *  "License"); you may not use this file except in compliance
 *  with the License.  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */
package org.incode.eurocommercial.contactapp.dom.number;

import java.util.Arrays;
import java.util.Set;

import com.google.common.collect.FluentIterable;

/**
 * Default set of {@link ContactNumber#getType() contact number type}s
 */
public enum ContactNumberType {

    OFFICE,
    MOBILE,
    HOME,
    WORK;

    public String title() {
        return name().charAt(0) + name().substring(1).toLowerCase();
    }

    public static Set<String> titles() {
        return FluentIterable
                .from(Arrays.asList(values()))
                .transform(ContactNumberType::title)
                .toSet();
    }

}
